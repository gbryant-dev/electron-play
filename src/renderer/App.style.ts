import styled from 'styled-components';


export const Container = styled.div`
  width: 100%;
  height: 100%;
  font-family: Cascadia Mono;
`;

export const Header = styled.header`
  width: 100%;
  height: 36px;
  background-color: var(--background-color);
  display: flex;
  align-items: center;
  padding-bottom: 0.5rem;
  justify-content: space-between;
  color: var(--color);
  -webkit-app-region: drag;
`;

export const AppBar = styled.div`
  display: flex;
  flex: 1;
  justify-content: space-between;
  align-items: center;
`;

export const AppIconContainer = styled.div`
  display: flex;
  align-items: center;
`;

export const Title = styled.h4`
  padding: 0 0.5rem;
`;