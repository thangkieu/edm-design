import { DroppableNames } from '@app/enums';
import { DragOutlined } from '@icons';
import { Space } from '@uikits';
import { separateModuleList } from '@utils/helpers';
import { isEqual } from 'lodash';
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from 'react-beautiful-dnd';
import styled, { css } from 'styled-components';

interface IProps {
  list: ModuleOrderItem[];
  onChange?(list: ModuleOrderItem[]): void;
}

const DroppableArea = styled.div<{ isDraggingOver?: boolean }>`
  ${(p) =>
    p.isDraggingOver &&
    css`
      background-color: #e6e1fd;
    `}
`;

const DragItem = styled.div<{ isDragging?: boolean; isFirstItem?: boolean }>`
  padding: 12px 24px;
  border-bottom: 1px solid #d9d9d9;
  background-color: #fafafa;

  ${(p) =>
    p.isFirstItem &&
    css`
      border-top: 1px solid #d9d9d9;
      border-bottom: 0;
    `};

  ${(p) =>
    p.isDragging &&
    css`
      border-radius: 4px;
      background-color: #e6e1fd;
      box-shadow: inset 2px 2px 0 ${(p) => p.theme.colors.primary},
        inset -2px -2px 0 ${(p) => p.theme.colors.primary};
    `};

  &:first-child {
    border-top: 1px solid #d9d9d9;
  }
`;

const reorder = (
  list: ModuleOrderItem[],
  startIndex: number,
  endIndex: number
) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

export const DraggingList = memo<IProps>(({ onChange, list: paramList }) => {
  const originalList = useRef<ModuleOrderItem[]>(paramList);

  const [list, setList] = useState(paramList);

  const handleDragEnd = useCallback(
    (result: DropResult) => {
      if (result.source.droppableId === result.destination?.droppableId) {
        const newList = reorder(
          list,
          result.source.index,
          result.destination.index
        );

        setList(newList as any);
        onChange?.(newList);
      }
    },
    [list, onChange]
  );

  useEffect(() => {
    if (!isEqual(paramList, originalList.current)) {
      setList(paramList);
      originalList.current = paramList;
    }
  }, [paramList]);

  const [header, body, footer] = useMemo(() => {
    return separateModuleList<ModuleOrderItem>(list);
  }, [list]);

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      {header.map((item) => (
        <DragItem isFirstItem key={item.id}>
          <strong>{item.label}</strong>
        </DragItem>
      ))}

      <Droppable droppableId={DroppableNames.ModuleConfigArea}>
        {(provided, snapshot) => (
          <DroppableArea
            {...provided.droppableProps}
            isDraggingOver={snapshot.isDraggingOver}
            ref={provided.innerRef}
          >
            {body.map((item, index) => (
              <Draggable
                key={item.id}
                draggableId={item.id}
                index={header.length + index}
              >
                {(provided, snapshot) => (
                  <DragItem
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    style={provided.draggableProps.style}
                    isDragging={snapshot.isDragging}
                    ref={provided.innerRef}
                  >
                    <Space>
                      <DragOutlined />
                      <strong>{item.label}</strong>
                    </Space>
                  </DragItem>
                )}
              </Draggable>
            ))}

            {provided.placeholder}
          </DroppableArea>
        )}
      </Droppable>

      {footer.map((item) => (
        <DragItem key={item.id}>
          <strong>{item.label}</strong>
        </DragItem>
      ))}
    </DragDropContext>
  );
});
