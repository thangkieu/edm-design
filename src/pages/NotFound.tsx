import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const Wrapper = styled.div`
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.03);
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  min-width: 20rem;
`;

const NotFound = memo(() => {
  return (
    <Wrapper>
      <h1>Oh no!!!</h1>
      <p>Page not found 😆</p>
      <Link to="/">Go back home</Link>
    </Wrapper>
  );
});

export default NotFound;
