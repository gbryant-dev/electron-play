import React, { MouseEvent } from 'react';
import { StyledButton } from './Button.style';

interface Props {
  onClick: (event: MouseEvent<HTMLButtonElement>) => any;
  accentColor?: string;
}

const Button: React.FC<Props> = ({ onClick, accentColor, children }) => {
  return (
    <StyledButton accentColor={accentColor} onClick={onClick}>
      {children}
    </StyledButton>
  );
};

export default Button;
