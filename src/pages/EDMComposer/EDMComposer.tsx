import { DefaultDesignConfig } from '@app/constants';
import { DroppableNames } from '@app/enums';
import { theme } from '@app/theme';
import { ExportEdmDesign } from '@components/ExportEdmDesign';
import { LayoutBasic } from '@components/Layout/Basic';
import { EMDDesignRenderer } from '@components/renderer/EMDDesignRenderer';
import { Tabs } from '@components/Tabs';
import {
  availModuleListFamilyState,
  currentDesignNameState,
  currentEdmThemeNameState,
  designConfigState,
  designModuleOrderState,
  edmThemeListState,
  isLoadingState,
  originalDesignConfigState,
} from '@recoil-atoms/atoms';
import {
  addNewModuleToCurrentDesignSelector,
  clearDesignComposerSelector,
} from '@recoil-atoms/selectors';
import { apiHelpers } from '@services/api';
import { getAllThemes, getThemeConfig } from '@services/themes';
import { Layout } from '@uikits';
import { reorder, uuidv4 } from '@utils/helpers';
import { isEqual } from 'lodash';
import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import {
  useRecoilCallback,
  useRecoilState,
  useRecoilValue,
  useResetRecoilState,
  useSetRecoilState,
} from 'recoil';
import styled from 'styled-components';
import DesignEditor from './DesignEditor';
import Settings from './Settings';

const { Content, Sider } = Layout;

const TabOverride = styled(Tabs)`
  box-shadow: 2px 3px 10px #7777771a;
  border: 1px solid ${(p) => p.theme.colors.border};
  height: 100%;

  display: flex;
  flex-direction: column;
`;

const LayoutBasicOverride = styled(LayoutBasic)`
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const TABS = [
  {
    name: 'Content',
    content: <DesignEditor />,
  },
  {
    name: 'Settings',
    content: <Settings />,
  },
];

const EDMComposerPage = memo(() => {
  const addNewModuleToDesign = useSetRecoilState(addNewModuleToCurrentDesignSelector);
  const [currentModuleOrder, updateCurrentModuleOrder] = useRecoilState(designModuleOrderState);

  const [localModuleOrder, updateLocalModuleOrder] = useState(currentModuleOrder);
  const moduleOrderFromRecoil = useRef<ModuleOrderItem[]>(currentModuleOrder);

  const handleDragEnd = useCallback(
    (result: DropResult) => {
      // re-order the array based on the result
      if (
        result.destination?.droppableId === DroppableNames.DesignArea &&
        DroppableNames.DesignArea === result.source?.droppableId
      ) {
        const newList = reorder(localModuleOrder, result.source.index, result.destination.index);

        updateLocalModuleOrder(newList);
        updateCurrentModuleOrder(newList);
      }

      // create new item
      if (
        result.destination?.droppableId === DroppableNames.DesignArea &&
        result.source?.droppableId === DroppableNames.AvailableModules
      ) {
        addNewModuleToDesign({
          moduleType: result.draggableId as ModuleTypeEnum,
          index: result.destination.index,
        });
      }
    },
    [addNewModuleToDesign, localModuleOrder, updateCurrentModuleOrder]
  );

  // update local state
  useEffect(() => {
    if (!isEqual(currentModuleOrder, moduleOrderFromRecoil.current)) {
      updateLocalModuleOrder(currentModuleOrder);
      moduleOrderFromRecoil.current = currentModuleOrder;
    }
  }, [currentModuleOrder]);

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <LayoutBasicOverride actions={<ExportEdmDesign />} hideFooter>
        <Layout>
          <Sider width={350} style={{ marginRight: theme.spacing.sm }} theme="light">
            <TabOverride tabs={TABS} />
          </Sider>
          <Content>
            <EMDDesignRenderer currentModuleOrder={localModuleOrder} />
          </Content>
        </Layout>
      </LayoutBasicOverride>
    </DragDropContext>
  );
});

interface Props {
  designName?: string;
  themeName?: string;
}

export const EDMComposerPageConnected = memo<Props>(() => {
  const themeName = useRecoilValue(currentEdmThemeNameState);
  const designName = useRecoilValue(currentDesignNameState);
  const ressetEdmComposerStore = useResetRecoilState(clearDesignComposerSelector);

  // load data
  const prefetch = useRecoilCallback(
    ({ set }) =>
      async () => {
        set(isLoadingState, true);
        const localThemeName = themeName || 'Default';

        const promises = await Promise.allSettled<
          [Promise<EdmDesignConfig[]>, Promise<EdmDesignConfig>, Promise<EdmDesignConfig>]
        >([
          getAllThemes(),
          getThemeConfig(localThemeName),
          designName ? apiHelpers.get(`/themes/${designName}.json`) : Promise.reject(),
        ]);

        const [edmThemesReq, themConfigReq, designConfigReq] = promises;
        let edmThemes: EdmDesignConfig[] = [];
        let themeConfig: EdmDesignConfig = {} as any;
        let designConfig: EdmDesignConfig = {
          ...DefaultDesignConfig,
          id: uuidv4(),
          ...(designName ? { name: designName } : {}),
          themeName: localThemeName,
        };

        if (edmThemesReq.status === 'fulfilled') edmThemes = edmThemesReq.value;
        if (themConfigReq.status === 'fulfilled') themeConfig = themConfigReq.value;
        if (designConfigReq.status === 'fulfilled') designConfig = designConfigReq.value;

        set(currentEdmThemeNameState, localThemeName);
        set(currentDesignNameState, designName);

        set(edmThemeListState, edmThemes);
        set(designConfigState, designConfig);
        set(availModuleListFamilyState(localThemeName), themeConfig?.modules || []);
        set(originalDesignConfigState, designConfig);

        set(isLoadingState, false);
      },
    [themeName, designName]
  );

  useEffect(() => {
    if (!themeName) prefetch();

    return () => {
      ressetEdmComposerStore();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <EDMComposerPage />;
});
