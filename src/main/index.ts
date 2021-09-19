import { app, BrowserWindow, ipcMain, net } from 'electron';
import * as fs from 'fs'
import { join } from 'path';
import { format } from 'url';
import axiosClient from './axiosClient';
import { Server, KeyValuePair } from './types';

const gotTheLock = app.requestSingleInstanceLock();

const CONFIG_FILE = 'config.json';
const DEFAULT_CONFIG_FILE = 'config.defaults.json';
const CONFIG_POLL_INTERVAL = 5000;
let interval: NodeJS.Timeout | null = null;

if (!gotTheLock) {
  app.quit();
} else {
  /**
   * Workaround for TypeScript bug
   * @see https://github.com/microsoft/TypeScript/issues/41468#issuecomment-727543400
   */
  const env = import.meta.env;

  // Install "Vue.js devtools BETA"
  if (env.MODE === 'development') {
    app
      .whenReady()
      .then(() => import('electron-devtools-installer'))
      .then(({ default: installExtension }) => {
        const REACT_DEVELOPER_TOOLS = 'fmkadmapgofadopljbjfkapdkoienihi';
        /** @see https://chrome.google.com/webstore/detail/vuejs-devtools/ljjemllljcmogpfapbkkighbhhppjdbg */
        return installExtension(REACT_DEVELOPER_TOOLS);
      })
      .catch((e) => console.error('Failed install extension:', e));

  }

  let mainWindow: BrowserWindow | null = null;
  interface AppConfig {
    theme: {
      fontColor?: string
    },
    hosts: string[],
    connections: {
      [instance: string]: {
        host: string,
        httpPort: number,
        ssl: boolean,
        baseUrl: string
      }
    }

  }
  let appConfig: AppConfig = { theme: {}, hosts: [], connections: {} }

  async function readConfig() {
    const path = app.getPath('userData');
    const configFile = `${path}/${CONFIG_FILE}`;

    // Check config file exists
    const configExists = fs.existsSync(configFile);

    if (!configExists) {
      const defaultConfigFile = `./templates/${DEFAULT_CONFIG_FILE}`;
      await fs.promises.copyFile(defaultConfigFile, configFile);
    }
    // If not, copy from config.defaults.json -> config.json
    const buf = await fs.promises.readFile(configFile, 'utf-8');
    const jsonConfig = JSON.parse(buf)

    const { theme, hosts, connections } = jsonConfig

    appConfig.theme = theme;
    appConfig.hosts = hosts;

    if (hosts) {
      for (const host of hosts) {
        const instances = await getTM1Instances(host)
        appConfig.connections = { ...appConfig.connections, ...instances }
      }
    }


  }

  function pollConfig() {
    interval = setInterval(async () => {
      await readConfig()
    }, CONFIG_POLL_INTERVAL)
  }


  async function getTM1Instances(host: string): Promise<AppConfig['connections']> {
    const url = `${host}/api/v1/Servers`;
    const { data } = await axiosClient.get<{ value: Server[] }>(url)

    const instances: AppConfig['connections'] = {}
    for (const { Name, Host, UsingSSL, HTTPPortNumber, IPAddress } of data.value) {
      instances[Name] = {
        host: Host,
        httpPort: HTTPPortNumber,
        ssl: UsingSSL,
        baseUrl: `http${UsingSSL ? 's' : ''}://${IPAddress}:${HTTPPortNumber}`
      }
    }

    return instances

  }

  async function createWindow() {
    mainWindow = new BrowserWindow({
      show: false,
      width: 1148,
      height: 624,
      minWidth: 200,
      minHeight: 200,
      backgroundColor: '#0C0C0C',
      transparent: true,
      opacity: 0.95,
      frame: false,
      webPreferences: {
        preload: join(__dirname, '../preload/index.cjs.js'),
        contextIsolation: env.MODE !== 'test', // Spectron tests can't work with contextIsolation: true
        enableRemoteModule: env.MODE === 'test',
        nodeIntegration: true,
        // sandbox: true, // Spectron tests can't work with enableRemoteModule: false
      },
    });

    /**
     * URL for main window.
     * Vite dev server for development.
     * `file://../renderer/index.html` for production and test
     */
    const URL =
      env.MODE === 'development'
        ? env.VITE_DEV_SERVER_URL
        : format({
          protocol: 'file',
          pathname: join(__dirname, '../renderer/index.html'),
          slashes: true,
        });

    await mainWindow.loadURL(URL);
    mainWindow.maximize();
    mainWindow.show();

    if (env.MODE === 'development') {
      mainWindow.webContents.openDevTools();
    }
  }

  app.on('second-instance', () => {
    // Someone tried to run a second instance, we should focus our window.
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });

  app.on('before-quit', () => {
    if (interval) {
      clearInterval(interval)
    }
  })

  app
    .whenReady()
    .then(readConfig)
    .then(pollConfig)
    .then(createWindow)
    .catch((e) => console.error('Failed create window:', e));


  // Auto-updates
  if (env.PROD) {
    app
      .whenReady()
      .then(() => import('electron-updater'))
      .then(({ autoUpdater }) => autoUpdater.checkForUpdatesAndNotify())
      .catch((e) => console.error('Failed check updates:', e));
  }

  ipcMain.on('window:close', function () {
    app.quit();
  })

  ipcMain.on('window:minimise', function () {
    mainWindow!.minimize()
  })

  ipcMain.on('window:maximise', function () {
    if (mainWindow!.isMaximized()) {
      mainWindow!.restore()
    } else {
      mainWindow!.maximize()
    }
  })

  ipcMain.handle('get:theme', async (event, data) => {
    return appConfig.theme
  })

  ipcMain.handle('get:instances', async (event, data) => {
    return appConfig.connections
    // return getTM1Instances('https://localhost:5898');
  })

  ipcMain.handle('process:execute', async (event, instance: string, name: string, parameters?: KeyValuePair[]) => {

    const { baseUrl } = appConfig.connections[instance]
    const url = `/api/v1/Processes('${name}')/tm1.Execute`;
    const body: { Parameters: KeyValuePair[] } = {
      Parameters: []
    }

    if (parameters) {
      for (const { Name, Value } of parameters) {
        body.Parameters.push({ Name, Value })
      }
    }

    return axiosClient.post(baseUrl + url, JSON.stringify(body));

    // const request = net.request({

    // })
    // request.on('response', response => {
    //   console.log(response.statusCode, response.headers)

    //   response.on('data', chunk => {

    //   })

    //   response.on('end', () => {

    //   })
    // })

    // request.end();

  })

}
