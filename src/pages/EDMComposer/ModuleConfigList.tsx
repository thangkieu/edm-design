import { EdmDesignModuleList } from '@components/EdmDesignModuleList';
import { PlusCircleOutlined } from '@icons';
import { designModuleOrderState, isReorderingState } from '@recoil-atoms/atoms';
import {
  addNewModuleToCurrentDesignSelector,
  designModulesConfigInOrderSelector,
} from '@recoil-atoms/selectors';
import { Button } from '@uikits';
import { FC, memo, useCallback, useEffect, useRef, useState } from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import styled from 'styled-components';
import { SelectedModules } from './SelectedModules';

interface IProps {}

const AddModuleButton = styled(Button)`
  color: ${(p) => p.theme.colors.primary};
  border: 0;
  border-bottom: 1px solid ${(p) => p.theme.colors.border};
  border-radius: 0;
  text-align: left;
  padding: ${(p) => p.theme.spacing.xs} ${(p) => p.theme.spacing.md};
  height: auto;
  box-shadow: none;

  &:hover {
    border-bottom-color: ${(p) => p.theme.colors.border};
  }
`;

export const ModuleConfigList: FC<IProps> = memo(() => {
  const curDesignModules = useRecoilValue(designModulesConfigInOrderSelector);
  // prettier-ignore
  const [moduleConfigOrder, updateModuleOrder] = useRecoilState(designModuleOrderState);
  // prettier-ignore
  const addNewModule = useSetRecoilState(addNewModuleToCurrentDesignSelector);
  const [isReordering, toggleReordering] = useRecoilState(isReorderingState);

  const [showModuleList, toggleModuleList] = useState(false);
  const [activeModuleFromRenderer, setActiveModuleFromRender] = useState('');

  const ordering = useRef<ModuleOrderItem[] | null>(null);
  const originalOrder = useRef<ModuleOrderItem[] | null>(null);

  const handleShowAddModule = useCallback(() => {
    toggleModuleList(!showModuleList);
  }, [showModuleList]);

  const handleOrderingChange = useCallback(
    (updatedOrdering: ModuleOrderItem[]) => {
      ordering.current = updatedOrdering;

      // update on the UI list
      updateModuleOrder(updatedOrdering);
    },
    [updateModuleOrder]
  );

  const handleConfirmReorder = useCallback(() => {
    toggleReordering(false);
  }, [toggleReordering]);

  const handleCancelOrdering = useCallback(() => {
    ordering.current = null;

    // reset changes on the UI list
    if (originalOrder.current) updateModuleOrder(originalOrder.current);

    toggleReordering(false);
  }, [toggleReordering, updateModuleOrder]);

  const handleAddNewModule = useCallback(
    (moduleType: ModuleTypeEnum) => {
      addNewModule({ moduleType });
    },
    [addNewModule]
  );

  const handleModuleClicked = useCallback(
    (e: any) => {
      if (showModuleList) toggleModuleList(false);

      setActiveModuleFromRender(e.detail);
    },
    [showModuleList]
  );

  useEffect(() => {
    if (curDesignModules?.length === 0 && !showModuleList) toggleModuleList(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [curDesignModules?.length]);

  useEffect(() => {
    if (isReordering) {
      originalOrder.current = moduleConfigOrder;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isReordering]);

  useEffect(() => {
    document.addEventListener('module-clicked', handleModuleClicked);

    return () => {
      document.removeEventListener('module-clicked', handleModuleClicked);
    };
  }, [handleModuleClicked]);

  return (
    <>
      {showModuleList ? (
        <EdmDesignModuleList
          onModuleClick={handleAddNewModule}
          selectedModules={curDesignModules}
          onClose={curDesignModules?.length === 0 ? undefined : handleShowAddModule}
        />
      ) : (
        <SelectedModules
          defaultActiveKey={activeModuleFromRenderer}
          modules={curDesignModules}
          isReordering={isReordering}
          toggleReordering={toggleReordering}
          onConfirmReorder={handleConfirmReorder}
          onCancelOrdering={handleCancelOrdering}
          onOrderingChange={handleOrderingChange}
        />
      )}

      {!showModuleList && !isReordering && (
        <AddModuleButton icon={<PlusCircleOutlined />} block onClick={handleShowAddModule}>
          Add a new module
        </AddModuleButton>
      )}
    </>
  );
});
