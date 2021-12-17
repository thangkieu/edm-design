import { DroppableNames } from '@app/enums';
import { theme } from '@app/theme';
import { DragOutlined } from '@components/Icons';
import { designConfigState, isReorderingState } from '@recoil-atoms/atoms';
import { Typography } from '@uikits';
import { separateModuleList } from '@utils/helpers';
import { memo, useEffect, useMemo, useRef } from 'react';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import { useRecoilValue } from 'recoil';
import styled, { css } from 'styled-components';
import { ModuleUIRendererConnector } from './ModuleUIRenderer';

interface EMDDesignRendererProps {
  currentModuleOrder: ModuleOrderItem[];
}

const Wrapper = styled.div`
  border: 1px solid ${(p) => p.theme.colors.border};
  overflow-y: auto;
  max-height: 100%;
`;

const Inner = styled.div`
  padding: 16px;
  background-color: white;
`;

const DragItem = styled.div<{ isDragging?: boolean; isReordering?: boolean }>`
  ${(p) =>
    p.isDragging &&
    css`
      border-radius: 4px;
      background-color: #e6e1fd;
      outline: 3px solid ${(p) => p.theme.colors.primary};
    `};

  ${(p) =>
    p.isReordering &&
    css`
      position: relative;
    `}
`;

const DragOutlinedStyle = styled(DragOutlined)`
  position: absolute;
  top: 4px;
  left: 4px;
  z-index: 2;
  background-color: white;
  padding: 0.5rem;
  border-radius: 4px;
  box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.2);
`;

const DroppableArea = styled.div<{ isDraggingOver?: boolean }>`
  min-height: 1rem;

  ${(p) =>
    p.isDraggingOver &&
    css`
      background-color: #e6e1fd;

      ${DragItem} {
        background-color: white;
      }
    `};
`;

export const EMDDesignRenderer = memo<EMDDesignRendererProps>(({ currentModuleOrder }) => {
  const isReordering = useRecoilValue(isReorderingState);
  const deisgnConfig = useRecoilValue(designConfigState);

  const moduleOrderRef = useRef<ModuleOrderItem[]>(currentModuleOrder);
  const scrollingEl = useRef<HTMLSpanElement>(null);

  const [header, body, footer] = useMemo(() => {
    return separateModuleList<ModuleOrderItem>(currentModuleOrder);
  }, [currentModuleOrder]);

  useEffect(() => {
    if (
      moduleOrderRef.current[moduleOrderRef.current.length - 1]?.id !==
      currentModuleOrder[currentModuleOrder.length - 1]?.id
    ) {
      scrollingEl.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'end',
        inline: 'nearest',
      });
    }

    moduleOrderRef.current = currentModuleOrder;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentModuleOrder.length]);

  return (
    <Wrapper>
      <Inner id="edm-design-renderer" style={{ backgroundColor: deisgnConfig?.backgroundColor }}>
        {header.map((item) => (
          <ModuleUIRendererConnector key={item.id} moduleId={item.id} />
        ))}

        <Droppable droppableId={DroppableNames.DesignArea}>
          {(provided, snapshot) => (
            <DroppableArea
              {...provided.droppableProps}
              isDraggingOver={snapshot.isDraggingOver}
              ref={provided.innerRef}
            >
              {currentModuleOrder?.length === 0 && (
                <Typography.Paragraph
                  type="secondary"
                  style={{
                    paddingTop: theme.spacing.md,
                    paddingBottom: theme.spacing.md,
                    textAlign: 'center',
                    margin: 0,
                  }}
                >
                  Add a new module via the left side bar to get started
                </Typography.Paragraph>
              )}

              {body?.map((item, index) => (
                <Draggable
                  key={item.id}
                  draggableId={item.id}
                  index={header.length + index}
                  isDragDisabled={!isReordering}
                >
                  {(provided, snapshot) => (
                    <DragItem
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={provided.draggableProps.style}
                      isDragging={snapshot.isDragging}
                      ref={provided.innerRef}
                      isReordering={isReordering}
                    >
                      {isReordering && <DragOutlinedStyle />}
                      <ModuleUIRendererConnector moduleId={item.id} />
                    </DragItem>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </DroppableArea>
          )}
        </Droppable>

        {footer.map((item) => (
          <ModuleUIRendererConnector key={item.id} moduleId={item.id} />
        ))}

        <span ref={scrollingEl} />
      </Inner>
    </Wrapper>
  );
});
