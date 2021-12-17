import { DeleteOutlined } from '@components/Icons';
import { Button } from '@uikits';
import { memo, useCallback } from 'react';
import styled from 'styled-components';

const UploadedActionsWrapper = styled.span`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  margin: 0;
  display: block;

  &::before {
    content: '';
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.3);
    opacity: 0;
    transition: opacity 0.3s ease-in-out;
  }

  .ant-btn {
    opacity: 0;
  }

  &:hover {
    &::before {
      opacity: 1;
    }
    .ant-btn {
      opacity: 1;
    }
  }
`;

const UploadedActions = styled.span`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: block;

  .ant-btn {
    color: white;
  }
`;

interface Props {
  data?: any;
  onDelete?(payload: any): void;
}

export const OverlayActions = memo<Props>(({ onDelete, data }) => {
  const handleDelete = useCallback<React.MouseEventHandler>(() => {
    onDelete?.(data);
  }, [onDelete, data]);

  return (
    <UploadedActionsWrapper>
      <UploadedActions>
        <Button type="text" icon={<DeleteOutlined />} ghost onClick={handleDelete} />
      </UploadedActions>
    </UploadedActionsWrapper>
  );
});
