import { MaxModuleInEdmDesign } from '@app/constants';
import { DroppableNames, ModuleTypeEnum } from '@app/enums';
import { FooterIcon, HeaderIcon, IconBase, ImageIcon, SpacerIcon, TextIcon } from '@icons';
import { Button, Typography } from '@uikits';
import { memo, useCallback, useMemo } from 'react';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import styled, { css } from 'styled-components';

interface EdmThemeModuleListProps {
  selectedModules?: ModuleConfig[];
  onModuleClick: (moduleType: ModuleTypeEnum) => void;
  onClose?: () => void;
}

type AvailableModule = {
  type: ModuleTypeEnum;
  icon: any;
  name: string;
};

const ModuleItemStyle = styled(Button)`
  display: inline-flex;
  align-items: center;
  padding: 1rem;
  box-shadow: 1px 2px 10px #7777771a;
  border: 0.5px solid ${(p) => p.theme.colors.border};
  border-radius: 3px;
  flex: 1 1 100%;
  width: 100%;
  color: ${(p) => p.theme.colors.subtle};
  font-size: ${(p) => p.theme.fontSize.sm};
  height: auto;
`;

const IconOverride = styled(IconBase)`
  margin-right: 0.5rem;
  flex-shrink: 0;
`;

const MODULES: AvailableModule[] = [
  {
    type: ModuleTypeEnum.Header,
    name: 'Header',
    icon: <IconOverride size="md" icon={HeaderIcon} />,
  },
  {
    type: ModuleTypeEnum.Footer,
    name: 'Footer',
    icon: <IconOverride size="md" icon={FooterIcon} />,
  },
  {
    type: ModuleTypeEnum.Text,
    name: 'Text',
    icon: <IconOverride size="md" icon={TextIcon} />,
  },
  {
    type: ModuleTypeEnum.Image,
    name: 'Image',
    icon: <IconOverride size="md" icon={ImageIcon} />,
  },
  {
    type: ModuleTypeEnum.ImageText,
    name: 'Image/Text',
    icon: <IconOverride size="md" icon={ImageIcon} />,
  },
  {
    type: ModuleTypeEnum.Spacer,
    name: 'Spacer',
    icon: <IconOverride size="md" icon={SpacerIcon} />,
  },
];

const ModuleItem = memo<
  Pick<EdmThemeModuleListProps, 'onModuleClick'> & {
    tmplModule: AvailableModule;
  }
>(({ tmplModule, onModuleClick }) => {
  const handleClick = useCallback(() => {
    onModuleClick(tmplModule.type);
  }, [tmplModule, onModuleClick]);

  return (
    <ModuleItemStyle key={tmplModule.type} onClick={handleClick}>
      {tmplModule.icon}
      {tmplModule.name}
    </ModuleItemStyle>
  );
});

const Wrapper = styled.div`
  border-top: 1px solid ${(p) => p.theme.colors.border};
  border-bottom: 1px solid ${(p) => p.theme.colors.border};

  padding: ${(p) =>
    css`
      ${p.theme.spacing.md}
    `};
`;

const ListWrapper = styled.div<{ isDraggingOver?: boolean }>`
  display: grid;
  ${({
    theme: {
      spacing: { sm },
    },
  }) => css`
    grid-template-columns: calc(50% - calc(${sm}) / 2) calc(50% - calc(${sm}) / 2);
    column-gap: ${sm};
    row-gap: ${sm};
  `};

  ${(p) =>
    p.isDraggingOver &&
    css`
      background-color: #e6e1fd;
    `}
`;

const Actions = styled.div`
  text-align: right;
  margin-top: ${(p) => p.theme.spacing.sm};
`;

const DragItem = styled.div<{ isDragging?: boolean; isDisabled?: boolean }>`
  ${(p) =>
    p.isDisabled &&
    css`
      opacity: 0.5;
      cursor: not-allowed;
      * {
        pointer-events: none;
      }
    `}

  ${(p) =>
    p.isDragging &&
    css`
      border-radius: 4px;
      background-color: #e6e1fd;
      box-shadow: inset 2px 2px 0 ${(p) => p.theme.colors.primary},
        inset -2px -2px 0 ${(p) => p.theme.colors.primary};
    `};
`;

export const EdmDesignModuleList = memo<EdmThemeModuleListProps>(
  ({ onModuleClick, onClose, selectedModules }) => {
    const addedModuleNo = useMemo(() => {
      return selectedModules?.reduce<Record<ModuleType, number>>(
        (acc, item) => ({ ...acc, [item.type]: (acc[item.type] || 0) + 1 }),
        {}
      );
    }, [selectedModules]);

    return (
      <Wrapper>
        <Typography.Title level={5} style={{ marginTop: 0 }}>
          Add a new module
        </Typography.Title>

        <Droppable droppableId={DroppableNames.AvailableModules} isDropDisabled>
          {(provided, snapshot) => (
            <ListWrapper
              {...provided.droppableProps}
              isDraggingOver={snapshot.isDraggingOver}
              ref={provided.innerRef}
            >
              {MODULES.map((item, index) => {
                const isDisabled =
                  typeof MaxModuleInEdmDesign[item.type] === 'number' &&
                  MaxModuleInEdmDesign[item.type] === addedModuleNo?.[item.type];

                return (
                  <Draggable
                    key={item.type}
                    draggableId={item.type}
                    index={index}
                    isDragDisabled={isDisabled}
                    disableInteractiveElementBlocking={true}
                  >
                    {(provided, snapshot) => (
                      <DragItem
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={provided.draggableProps.style}
                        isDragging={snapshot.isDragging}
                        ref={provided.innerRef}
                        isDisabled={isDisabled}
                      >
                        <ModuleItem
                          key={item.type}
                          onModuleClick={onModuleClick}
                          tmplModule={item}
                        />
                      </DragItem>
                    )}
                  </Draggable>
                );
              })}
              {provided.placeholder}
            </ListWrapper>
          )}
        </Droppable>

        {typeof onClose === 'function' && (
          <Actions>
            <Button type="primary" ghost onClick={onClose}>
              Done
            </Button>
          </Actions>
        )}
      </Wrapper>
    );
  }
);
