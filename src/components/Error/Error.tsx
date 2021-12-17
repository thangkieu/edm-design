import { memo, FC } from 'react';
import styled from 'styled-components';
import { DisconnectOutlined } from '@icons';
import { Typography } from '@uikits';

interface ErrorProps {
  message: string;
  className?: string;
}

const ErrorStyle = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2em;
  border-radius: 0.5em;
  border: 1px solid ${(p) => p.theme.colors.border};
  background-color: white;

  svg {
    width: 5em;
    height: 5em;
  }
`;

const Message = styled(Typography.Text)`
  margin-top: 2em;
  margin-bottom: 0;
`;

export const Error: FC<ErrorProps> = memo((props) => {
  return (
    <ErrorStyle className={props.className}>
      <DisconnectOutlined />
      <Message>{props.message}</Message>
    </ErrorStyle>
  );
});
