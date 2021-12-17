import { theme } from '@app/theme';
import { LoadingOutlined } from '@icons';
import { memo } from 'react';
import styled from 'styled-components';

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.7);
  z-index: 1;
`;

export const OverlayLoading = memo(() => {
  return (
    <Overlay>
      <LoadingOutlined style={{ fontSize: 30, color: theme.colors.primary }} />
    </Overlay>
  );
});
