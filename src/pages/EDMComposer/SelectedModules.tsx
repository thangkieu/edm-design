import { DraggingList } from '@components/DraggingList';
import { designModuleOrderState } from '@recoil-atoms/atoms';
import { addNewModuleToCurrentDesignSelector, removeModuleSelector } from '@recoil-atoms/selectors';
import { Collapse } from '@uikits';
import { useState, FC, memo, useCallback, useMemo, useEffect } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import styled from 'styled-components';
import { ModuleListTopActions } from './ModuleListTopActions';
import { SelectedModuleItem } from './SelectedModuleItem';

interface IProps {
  modules: ModuleConfig[];
  isReordering: boolean;
  defaultActiveKey?: string;
  toggleReordering(status: boolean): void;
  onConfirmReorder(): void;
  onCancelOrdering(): void;
  onOrderingChange(updatedOrdering: ModuleOrderItem[]): void;
}

const CollapseOverride = styled(Collapse)`
  border-right: 0;
  border-left: 0;
`;

export const SelectedModules: FC<IProps> = memo(
  ({
    isReordering,
    modules,
    defaultActiveKey,
    toggleReordering,
    onConfirmReorder,
    onCancelOrdering,
    onOrderingChange,
  }) => {
    const moduleOrderList = useRecoilValue(designModuleOrderState);

    const removeModule = useSetRecoilState(removeModuleSelector);
    const addNewModule = useSetRecoilState(addNewModuleToCurrentDesignSelector);

    const [activeKey, toggleActiveKey] = useState(defaultActiveKey || '');

    const handleToggle = useCallback((id) => {
      toggleActiveKey(id);

      document.getElementById(id)?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
        inline: 'nearest',
      });
    }, []);

    const addedModulesNo = useMemo(
      () =>
        modules?.reduce<Record<ModuleType, number>>(
          (acc, item) => ({ ...acc, [item.type]: (acc[item.type] || 0) + 1 }),
          {}
        ),
      [modules]
    );

    useEffect(() => {
      if (defaultActiveKey) {
        toggleActiveKey(defaultActiveKey);

        setTimeout(() => {
          document.getElementById(`module-config-${defaultActiveKey}`)?.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
            inline: 'start',
          });
        }, 300);
      }
    }, [defaultActiveKey]);

    return (
      <>
        <ModuleListTopActions
          isReordering={isReordering}
          onConfirm={onConfirmReorder}
          onCancel={onCancelOrdering}
          toggleReordering={toggleReordering}
        />
        {isReordering ? (
          <DraggingList list={moduleOrderList} onChange={onOrderingChange} />
        ) : (
          <CollapseOverride
            activeKey={activeKey}
            accordion
            onChange={handleToggle}
            expandIconPosition="right"
          >
            {modules.map((item, index) => (
              <SelectedModuleItem
                key={item.id}
                id={`module-config-${item.id}`}
                item={item}
                itemIndex={index}
                onRemoveModule={removeModule}
                onAddNewModule={addNewModule}
                addedModulesNo={addedModulesNo[item.type]}
              />
            ))}
          </CollapseOverride>
        )}
      </>
    );
  }
);
