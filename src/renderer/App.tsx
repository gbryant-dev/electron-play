import React, { MouseEvent, useState } from 'react';
import { AppIconContainer, Container, Header, Title } from './App.style';
import Button from './components/Button/Button';
import closeIcon from './icons/close-white.png';
import minimiseIcon from './icons/minimise-white.png';
import maximiseIcon from './icons/maximise-white.png';
import { useElectron } from './use/electron';
import { Editor } from './components/Editor/Editor';

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
      <Editor />
    </Container>
  );
};

export default App;
