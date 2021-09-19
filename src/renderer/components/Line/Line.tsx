import React, { FC } from 'react';
import { Indicator, StyledInput } from '../Terminal/Terminal.style';
import { LineContainer } from './Line.style';
import { Command } from '/@/types/Terminal';

interface Props {
  command: Command;
}

const Line: FC<Props> = ({ command, children }) => {
  return (
    <LineContainer>
      <Indicator />
      <StyledInput readOnly={command.isHistory} value={command.content} />
    </LineContainer>
  );
};

export default Line;
