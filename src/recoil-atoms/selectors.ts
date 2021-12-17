import { MaxModuleInEdmDesign, ModuleNamesMapping } from '@app/constants';
import { ModuleTypeEnum } from '@app/enums';
import { removeToken } from '@services/api/base-api';
import { mergeDeep, updateId, uuidv4 } from '@utils/helpers';
import produce from 'immer';
import { isEqual } from 'lodash';
import { DefaultValue, selector, selectorFamily } from 'recoil';
import {
  applyFixedItemOfModuleOrder,
  availModuleListFamilyState,
  currentDesignNameState,
  currentEdmThemeNameState,
  designConfigState,
  designHistoryState,
  designModuleCollState,
  designModuleOrderState,
  edmThemeListState,
  htmlKeyState,
  isLoadingState,
  isReorderingState,
  originalDesignConfigState,
} from './atoms';
import { userInfoState } from './user-info';

const availModuleCollSelector = selector<ModuleCollection>({
  key: 'availModuleCollSelector',
  get: ({ get }) => {
    const themeName = get(currentEdmThemeNameState);
    const modules = get(availModuleListFamilyState(themeName));

    return (
      modules.reduce(
        (acc, item) => ({
          ...acc,
          [item.type]: item,
        }),
        {}
      ) || {}
    );
  },
});

export const designModulesConfigInOrderSelector = selector<ModuleConfig[]>({
  key: 'designModulesConfigInOrderSelector',
  get: ({ get }) => {
    const moduleCollection = get(designModuleCollState);
    const moduleOrder = get(designModuleOrderState);

    return moduleOrder.map((item) => moduleCollection[item.id]);
  },
});

export const singleDesignModuleSelector = selectorFamily<ModuleConfig, string>({
  key: 'singleDesignModuleSelector',
  get:
    (moduleId) =>
    ({ get }) => {
      const moduleCollection = get(designModuleCollState);

      return moduleCollection[moduleId];
    },
  set:
    (moduleId) =>
    ({ set, get }, newValue) => {
      if (!newValue || newValue instanceof DefaultValue) return;

      let moduleCollection = get(designModuleCollState);

      set(
        designModuleCollState,
        produce(moduleCollection, (draft) => {
          draft[moduleId] = mergeDeep({}, draft[moduleId], newValue);
        })
      );
    },
});

export const addNewModuleToCurrentDesignSelector = selector<{
  moduleType?: ModuleTypeEnum;
  index?: number;
  sourceData?: ModuleConfig;
} | null>({
  key: 'addNewModuleToCurrentDesignSelector',
  get: () => null,
  set: ({ get, set }, payload) => {
    if (payload instanceof DefaultValue || !payload) return;

    let newModule: ModuleConfig | null = null;

    const newId = uuidv4();

    const { moduleType, index: position, sourceData } = payload;

    if (sourceData) {
      // duplicate
      newModule = { ...sourceData, id: newId } as ModuleConfig;
    } else if (moduleType) {
      const availableModules = get(availModuleCollSelector);

      const moduleDetails = availableModules[moduleType];

      if (moduleDetails) {
        newModule = { ...moduleDetails, id: newId };
      }
    }

    if (!newModule) return;

    const designModuleCollection = get(designModuleCollState);

    // checking maximum item could be added
    if (MaxModuleInEdmDesign[newModule.type]) {
      const addedNo = Object.values(designModuleCollection).filter(
        (item) => item.type === newModule?.type
      ).length;

      if (addedNo === MaxModuleInEdmDesign[newModule.type]) return;
    }

    // add new item to collection
    set(
      designModuleCollState,
      produce(designModuleCollection, (draft) => {
        if (newModule) draft[newId] = newModule;
      })
    );

    const newList = produce(get(designModuleOrderState), (draft) => {
      if (newModule) {
        const moduleOrderItem: ModuleOrderItem = {
          id: newId,
          label: ModuleNamesMapping[newModule.type],
          type: newModule.type,
        };

        if (typeof position === 'number') {
          draft.splice(position, 0, moduleOrderItem);
        } else {
          draft.push(moduleOrderItem);
        }

        draft = draft.sort(applyFixedItemOfModuleOrder);
      }
    });

    // add new item to module list order
    set(designModuleOrderState, newList);
  },
});

export const removeModuleSelector = selector<string | null>({
  key: 'removeModuleSelector',
  get: () => null,
  set: ({ set, get }, id) => {
    if (!id) return;

    const moduleCollection = get(designModuleCollState);

    set(
      designModuleCollState,
      produce(moduleCollection, (draft) => {
        delete draft[id as string];
      })
    );

    const moduleOrder = get(designModuleOrderState);
    const newOrder = moduleOrder.filter((item) => item.id !== id);

    set(designModuleOrderState, newOrder);
  },
});

export const saveDesignSelector = selector<
  { htmlFileKey?: string; screenshot?: string } | null | undefined
>({
  key: 'saveDesignSelector',
  get: () => null,
  set: ({ get, set }, newValue) => {
    if (newValue instanceof DefaultValue || !newValue) return;

    const { htmlFileKey, screenshot } = newValue;

    const designConfig = get(designConfigState);
    const designHistory = get(designHistoryState);

    const modules = get(designModulesConfigInOrderSelector);

    if (!designConfig) return;

    const updatedDesignConfig = produce(designConfig, (draft) => {
      draft.modules = modules;
    });

    set(designConfigState, updatedDesignConfig);

    if (get(designConfigModifiedSelector)) {
      set(
        designHistoryState,
        produce(designHistory, (draft) => {
          draft[Date.now()] = {
            label: '',
            designConfig: produce(updatedDesignConfig, (draft) => {
              updateId<EdmDesignConfig>(draft);
            }),
            thumb: screenshot,
            htmlFileKey: htmlFileKey || '',
          };
        })
      );

      set(originalDesignConfigState, updatedDesignConfig);
    }
  },
});

const ConfigPropsNeedToKeep: Array<string | string[]> = ['text', 'imgConfig', 'uploadedImages'];

export const applyThemeSelector = selector<Pick<EdmDesignConfig, 'name' | 'modules'> | null>({
  key: 'applyThemeSelector',
  get: () => null,
  set({ get, set }, theme) {
    if (theme instanceof DefaultValue || !theme) return;

    const designConfig = get(designConfigState);
    const modules = get(designModulesConfigInOrderSelector);

    if (!designConfig) return;

    set(availModuleListFamilyState(theme.name), theme.modules || []);

    const newModules = produce(modules, (draft) => {
      draft.forEach((item) => {
        let newItemConfig = theme.modules.find((i) => i.type === item.type)?.config;
        item.key = `new-${uuidv4()}`;

        if (!newItemConfig) return;

        newItemConfig = produce(newItemConfig, (draft) => {
          // keep some props
          ConfigPropsNeedToKeep.forEach((key) => {
            if (Array.isArray(key)) {
              const [key1, key2] = key;
              if (key1 in draft && key2 in (draft as any)[key1]) {
                (draft as any)[key1][key2] = (item.config as any)[key1][key2];
              }
            } else {
              (draft as any)[key] = (item.config as any)[key];
            }
          });
        });

        item.config = newItemConfig;

        if (item.type === ModuleTypeEnum.Spacer) {
          return;
        }

        const newItemTemplate = (theme.modules.find((i) => i.type === item.type) as any)?.template;

        item.template = newItemTemplate;
      });
    });

    set(
      designConfigState,
      produce(designConfig, (draft) => {
        draft.themeName = theme.name;
        draft.modules = newModules;
      })
    );

    set(
      designModuleCollState,
      newModules.reduce((acc, item) => ({ ...acc, [item.id]: item }), {})
    );

    set(originalDesignConfigState, get(designConfigState));
  },
});

export const replaceByDesignConfigSelector = selector<EdmDesignConfig | null>({
  key: 'replaceByDesignConfigSelector',
  get: () => null,
  set({ set }, newDesignConfig) {
    if (newDesignConfig instanceof DefaultValue || !newDesignConfig) return;

    set(currentEdmThemeNameState, newDesignConfig.themeName);
    set(designConfigState, newDesignConfig);

    set(
      designModuleCollState,
      newDesignConfig.modules.reduce((acc, item) => ({ ...acc, [item.id]: item }), {})
    );
    set(
      designModuleOrderState,
      newDesignConfig.modules.map((item) => ({
        id: item.id,
        label: ModuleNamesMapping[item.type],
        type: item.type,
      }))
    );

    set(originalDesignConfigState, newDesignConfig);
  },
});

export const designConfigModifiedSelector = selector<boolean>({
  key: 'designConfigModifiedSelector',
  get: ({ get }) => {
    const originalDesignConfig = get(originalDesignConfigState);
    const designConfig = get(designConfigState);
    const modules = get(designModulesConfigInOrderSelector);

    return !isEqual(originalDesignConfig, { ...designConfig, modules });
  },
});

const ThemeOrder = ['default'];
export const edmThemeListSelector = selector<EdmDesignConfig[]>({
  key: 'edmThemeListSelector',
  get: ({ get }) => {
    const list = get(edmThemeListState);

    return produce(list, (draft) => {
      draft.sort((a, b) => {
        return ThemeOrder.indexOf(b.name.toLowerCase()) - ThemeOrder.indexOf(a.name.toLowerCase());
      });
    });
  },
});

export const savedDesignHistorySelector = selector<null | { time: string; label: string }>({
  key: 'savedDesignHistorySelector',
  get: () => null,
  set: ({ set, get }, newValue) => {
    if (newValue instanceof DefaultValue || !newValue) return;

    const { time, label } = newValue;
    const allHistories = get(designHistoryState);

    set(
      designHistoryState,
      produce(allHistories, (draft) => {
        const history = allHistories[time];

        if (!history) return;

        draft[time].label = label;
      })
    );
  },
});

// RESET
export const clearDesignComposerSelector = selector({
  key: 'clearDesignComposerSelector',
  get: () => null,
  set: ({ reset }) => {
    reset(currentEdmThemeNameState);
    reset(currentDesignNameState);
    reset(designConfigState);
    reset(designModuleCollState);
    reset(designHistoryState);
    reset(originalDesignConfigState);
    reset(designModuleOrderState);
  },
});

export const logoutSelector = selector({
  key: 'logoutSelector',
  get: () => undefined,
  set: ({ reset }) => {
    removeToken();

    reset(clearDesignComposerSelector);
    reset(edmThemeListState);
    reset(currentEdmThemeNameState);
    reset(currentDesignNameState);
    reset(designConfigState);
    reset(designModuleCollState);
    reset(designModuleOrderState);
    reset(isReorderingState);
    reset(isLoadingState);
    reset(designHistoryState);
    reset(originalDesignConfigState);
    reset(htmlKeyState);
    reset(userInfoState);
  },
});
