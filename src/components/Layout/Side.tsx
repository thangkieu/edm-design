import React, { memo } from 'react';
import styled, { css } from 'styled-components';

const Container = styled.div<{ bg?: string }>`
  display: flex;
  height: 100vh;
  justify-content: flex-end;

  ${(p) =>
    p.bg &&
    css`
      background-image: linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.5)), url('${p.bg}');
      background-size: cover;
    `}
`;

const SideStyle = styled.div`
  height: 100%;
  max-width: 40em;
  flex-grow: 1;
  justify-self: flex-end;
  background-color: white;
  display: flex;
  justify-content: center;
  padding: 1em 4em;
  flex-direction: column;
  box-shadow: 0 0 10px 5px rgb(255 255 255 / 20%);
`;

export const LayoutSide = memo((props) => {
  return (
    <Container bg="https://picsum.photos/id/1029/4887/2759">
      <SideStyle>{props.children}</SideStyle>
    </Container>
  );
});
