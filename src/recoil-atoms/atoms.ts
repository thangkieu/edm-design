import { ModuleNamesMapping } from '@app/constants';
import { ModuleTypeEnum } from '@app/enums';
import { atom, atomFamily, selector } from 'recoil';

export function applyFixedItemOfModuleOrder(item1: ModuleOrderItem, item2: ModuleOrderItem) {
  if (item1.type === ModuleTypeEnum.Header) return -1;
  if (item2.type === ModuleTypeEnum.Header) return 1;

  if (item1.type === ModuleTypeEnum.Footer) return 1;
  if (item2.type === ModuleTypeEnum.Footer) return -1;

  return 0;
}

/**
 * Load available modules by theme name
 * this atom cannot be modified
 */
export const edmThemeListState = atom<EdmDesignConfig[]>({
  key: 'edmThemeListState',
  default: [],
});

export const currentEdmThemeNameState = atom<string>({
  key: 'currentEdmThemeName',
  default: '',
});

export const currentDesignNameState = atom<string>({
  key: 'currentDesignNameState',
  default: '',
});

export const availModuleListFamilyState = atomFamily<ModuleConfig[], string>({
  key: 'availModuleListFamilyState',
  default: [],
});

export const designConfigState = atom<EdmDesignConfig | null>({
  key: 'designConfigState',
  default: null,
});

/**
 * Return modules collection by design name
 * @param designName [string]
 */
export const designModuleCollState = atom<ModuleCollection>({
  key: 'designModuleCollState',
  default: selector({
    key: 'designModuleCollState/default',
    get: ({ get }) => {
      const designConfig = get(designConfigState);

      if (!designConfig) return {};

      return designConfig.modules?.reduce(
        (acc, item) => ({
          ...acc,
          [item.id]: item,
        }),
        {}
      );
    },
  }),
});

/**
 * This is the list of current design modules sequence
 * use as origin order
 */
export const designModuleOrderState = atom<ModuleOrderItem[]>({
  key: 'designModuleOrderState',
  default: selector({
    key: 'designModuleOrderState/default',
    get: ({ get }) => {
      const moduleCollection = get(designModuleCollState);

      const list = Object.values(moduleCollection).map((item) => ({
        id: item.id,
        label: ModuleNamesMapping[item.type],
        type: item.type,
      }));

      list.sort(applyFixedItemOfModuleOrder);

      return list;
    },
  }),
});

export const isReorderingState = atom<boolean>({
  key: 'isReorderingState',
  default: false,
});

export const isLoadingState = atom<boolean>({
  key: 'isLoadingState',
  default: false,
});

export const designHistoryState = atom<SavedDesignHistory>({
  key: 'designHistoryState',
  default: {},
});

export const originalDesignConfigState = atom<EdmDesignConfig | null>({
  key: 'originalDesignConfigState',
  default: null,
});

export const htmlKeyState = atom<string | undefined>({
  key: 'htmlKeyState',
  default: '',
});
