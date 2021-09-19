import React, {
  ChangeEvent,
  FC,
  KeyboardEvent,
  useEffect,
  useRef,
  useState,
} from 'react';
import { LineContainer } from '../Line/Line.style';
import { Indicator, StyledInput } from '../Terminal/Terminal.style';
import { Command as CommandItem } from '/@/types/Terminal';

interface Props {
  onUpdateHistory: (command: string) => void;
  onSaveToHistory: (command: string) => void;
  history: CommandItem[];
}

const Command: FC<Props> = ({ history, onSaveToHistory }) => {
  const [command, setCommand] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const historyIndexRef = useRef(-1);

  useEffect(() => {
    historyIndexRef.current = history.length;
  }, [history]);

  const getHistoryItem = (goForward = false): string => {
    if (!history.length) return '';

    const index = goForward
      ? historyIndexRef.current + 1
      : historyIndexRef.current - 1;

    if (history[index] === undefined) return command;

    historyIndexRef.current = index;
    return history[index].content;
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    let newCommand = '';
    switch (e.key) {
      case 'Enter':
        onSaveToHistory(command);
        break;
      case 'ArrowUp':
        newCommand = getHistoryItem();
        break;
      case 'ArrowDown':
        newCommand = getHistoryItem(true);
        break;
      default:
        return;
    }
    setCommand(newCommand);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCommand(e.target.value);
  };

  return (
    <LineContainer>
      <Indicator />
      <StyledInput
        onKeyDown={handleKeyDown}
        ref={(ref) => ref && ref.focus()}
        type="text"
        value={command}
        onChange={handleChange}
      />
    </LineContainer>
  );
};

export default Command;
