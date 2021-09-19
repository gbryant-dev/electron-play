import { ButtonHTMLAttributes } from "react";
import styled, { CSSObject } from "styled-components";


export const StyledButton = styled.button<{ accentColor?: string }>`
  width: 45px;
  height: 36px;
  border: none;
  outline: none;
  background-repeat: no-repeat;
  background-color: var(--background-color);
  background-position: center;
  color: var(--color);
  transition: 0.2s;
  -webkit-app-region: no-drag;

  &:hover, :active {
    background-color: ${props => props.accentColor || 'var(--accent-color)'};
  }

`;

