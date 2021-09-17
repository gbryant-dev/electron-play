import { app, BrowserWindow, ipcMain } from 'electron';
import { join } from 'path';
import { format } from 'url';

const gotTheLock = app.requestSingleInstanceLock();

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
        nodeIntegration: true
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

  app
    .whenReady()
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
}
