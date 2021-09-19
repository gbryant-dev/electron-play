import React, { MouseEvent, useEffect, useState } from 'react';
import { AppIconContainer, Container, Header, Title } from './App.style';
import Button from './components/Button/Button';
import { closeIcon, minimiseIcon, maximiseIcon } from './icons/index';
import { useElectron } from './use/electron';
import { Terminal } from './components/Terminal/Terminal';

const App: React.FC = () => {
  const electron = useElectron();

  const handleClose = (e: MouseEvent<HTMLButtonElement>) => {
    electron.closeWindow();
  };
  const handleMinimise = (e: MouseEvent<HTMLButtonElement>) => {
    electron.minimiseWindow();
  };
  const handleMaximise = (e: MouseEvent<HTMLButtonElement>) => {
    electron.maximiseWindow();
  };

  const getInstances = async () => {
    const res = await electron.getInstances();
    console.log({ instances: res });
  };

  const setupTheme = async () => {
    const theme = await electron.getTheme();
    console.log(theme);
    Object.keys(theme).forEach((key) => {
      const cssKey = `--${key}`;
      const cssValue = theme[key];
      document.documentElement.style.setProperty(cssKey, cssValue);
    });
  };

  useEffect(() => {
    // let interval = setInterval(() => setupTheme(), 5000);

    setupTheme();
    getInstances();

    // return () => clearInterval(interval);
  }, []);

  return (
    <Container>
      <Header>
        <Title>Terminal</Title>
        <AppIconContainer>
          <Button onClick={handleMinimise}>
            <img src={minimiseIcon} />
          </Button>
          <Button onClick={handleMaximise}>
            <img src={maximiseIcon} />
          </Button>
          <Button accentColor="red" onClick={handleClose}>
            <img src={closeIcon} />
          </Button>
        </AppIconContainer>
      </Header>
      <Terminal />
    </Container>
  );
};

export default App;
