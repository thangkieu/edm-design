import { memo, useCallback } from 'react';
import styled from 'styled-components';
import { Button } from '@components/UIKits';
import { DragOutlined } from '@components/Icons';

const TopActions = styled.div`
  text-align: right;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  padding: 4px calc(${(p) => p.theme.spacing.md} - 7px);
`;

const NoBorderButton = styled(Button)`
  border: 0;
  box-shadow: none;
  border-radius: 0;

  & + & {
    border-left: 1px solid ${({ theme }) => theme.colors.border};
  }
`;

interface Props {
  isReordering: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  toggleReordering(status: boolean): void;
}

export const ModuleListTopActions = memo<Props>(
  ({ isReordering, onCancel, onConfirm, toggleReordering }) => {
    const handleToggle = useCallback(() => {
      toggleReordering(!isReordering);
    }, [isReordering, toggleReordering]);

    return (
      <TopActions>
        {isReordering ? (
          <>
            <NoBorderButton type="text" size="small" onClick={onCancel}>
              Cancel
            </NoBorderButton>
            <NoBorderButton
              type="primary"
              ghost
              size="small"
              onClick={onConfirm}
            >
              Confirm Reorder
            </NoBorderButton>
          </>
        ) : (
          <NoBorderButton
            type="primary"
            ghost
            style={{ border: 0 }}
            icon={<DragOutlined />}
            size="small"
            onClick={handleToggle}
          >
            Reorder
          </NoBorderButton>
        )}
      </TopActions>
    );
  }
);
