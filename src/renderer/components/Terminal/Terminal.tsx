import React, { FC, useRef, useState } from 'react';
import Command from '../Command/Command';
import Line from '../Line/Line';
import { Container } from './Terminal.style';
import { Command as CommandItem, COMMANDS } from '/@/types/Terminal';

export const Terminal: FC = () => {
  const [history, setHistory] = useState<CommandItem[]>([]);

  const handleSaveHistory = (command: string) => {
    const newHistory = handleUpdateHistory(command);

    if (newHistory) {
      setHistory(newHistory);
      return;
    }

    const currentHistory = history.slice();
    currentHistory.push({
      id: currentHistory.length,
      content: command,
      isHistory: true,
    });

    setHistory(currentHistory);
  };

  const handleUpdateHistory = (command: string) => {
    const upper = command.toUpperCase();
    if (upper === COMMANDS.CLEAR) {
      return [];
    }

    return null;
  };

  return (
    <Container>
      {history.map((item) => {
        return <Line key={item.id} command={item}></Line>;
      })}
      <Command
        history={history}
        onSaveToHistory={handleSaveHistory}
        onUpdateHistory={handleUpdateHistory}
      />
    </Container>
  );
};
