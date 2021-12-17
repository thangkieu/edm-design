import { MaxModuleInEdmDesign, ModuleNamesMapping } from '@app/constants';
import { ModuleConfigRendererConnect } from '@components/renderer/ModuleConfigRenderer/ModuleConfigRenderer';
import { CopyOutlined, DeleteOutlined } from '@icons';
import { Button, Collapse, Popconfirm, Tooltip } from '@uikits';
import React, { FC, memo, useCallback, useMemo } from 'react';
import styled from 'styled-components';

interface IProps {
  item: ModuleConfig;
  itemIndex: number;
  addedModulesNo?: number;
  id?: string;
  onRemoveModule(id: string): void;
  onAddNewModule(payload: { sourceData: ModuleConfig; index: number }): void;
}

const ButtonOverride = styled(Button)`
  border: 0;
  background-color: transparent;
  box-shadow: none;
  padding-top: 0;
  padding-bottom: 0;
  height: auto;
  line-height: 1;
`;

function stopPropagation(event?: React.MouseEvent) {
  event?.stopPropagation();
}

export const SelectedModuleItem: FC<IProps> = memo(
  ({ item, itemIndex, onRemoveModule, onAddNewModule, addedModulesNo, ...props }) => {
    const handleRemoveModule = useCallback(
      (event?: React.MouseEvent<HTMLElement>, id?: string) => {
        event?.stopPropagation();

        if (item.id) onRemoveModule(item.id);
      },
      [onRemoveModule, item.id]
    );

    const handleDuplicateModule = useCallback(
      (event: React.MouseEvent<HTMLElement>) => {
        event.stopPropagation();

        onAddNewModule({ sourceData: item, index: itemIndex });
      },
      [onAddNewModule, item, itemIndex]
    );

    const isDuplicatable = useMemo(() => {
      if (typeof MaxModuleInEdmDesign[item.type] !== 'number') return true;

      if (!addedModulesNo) return true;

      return MaxModuleInEdmDesign[item.type] < addedModulesNo;
    }, [addedModulesNo, item.type]);

    return (
      <Collapse.Panel
        id={props.id}
        key={item.id}
        {...props}
        header={<strong>{ModuleNamesMapping[item.type]}</strong>}
        extra={
          <>
            {isDuplicatable && (
              <ButtonOverride
                onClick={handleDuplicateModule}
                icon={
                  <Tooltip placement="top" title="Duplicate">
                    <CopyOutlined />
                  </Tooltip>
                }
              ></ButtonOverride>
            )}
            <Popconfirm
              placement="top"
              title="Are you sure to delete this module?"
              onConfirm={handleRemoveModule}
              okText="Yes"
              cancelText="No"
              okButtonProps={{ danger: true }}
              onCancel={stopPropagation}
            >
              <ButtonOverride
                danger
                onClick={stopPropagation}
                data-id={item.id}
                icon={<DeleteOutlined type="danger" />}
              ></ButtonOverride>
            </Popconfirm>
          </>
        }
      >
        <ModuleConfigRendererConnect moduleConfig={item} />
      </Collapse.Panel>
    );
  }
);
