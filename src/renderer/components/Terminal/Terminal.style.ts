import styled, { keyframes } from 'styled-components';


export const Container = styled.div`
  min-height: 25px;
  color: var(--color);
  display: flex;
  background-color: var(--background-color);
  padding: 0.25rem;
  font-size: 16px;
  font-weight: bold;
  flex-direction: column;
`;

const blink = keyframes`
  0% {
    opacity: 0;
  }
  50% {
    opacity: .5;
  }
  100% {
    opacity: 1;
  }
`;

export const Indicator = styled.span`
  height: 20px;
  width: 20px;
  background-image: url('../../icons/chevron_right_white.png');
  background-repeat: no-repeat;
  background-color: var(--background-color);
  background-position: center;
  color: var(--color);
  
`;

export const StyledInput = styled.input`
  width: 100%;
  border: none;
  outline: none;
  background-color: var(--background-color);
  height: 100%;
  color: var(--fontColor);
  font-weight: bold;
  font-size: 1rem;
  font-family: Cascadia Mono;
`;