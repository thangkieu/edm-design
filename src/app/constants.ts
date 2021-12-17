import { ModuleTypeEnum } from './enums';

export const ModuleNamesMapping = {
  [ModuleTypeEnum.Text]: 'Text Module',
  [ModuleTypeEnum.Image]: 'Image Module',
  [ModuleTypeEnum.ImageText]: 'Image/Text Module',
  [ModuleTypeEnum.Header]: 'Header Module',
  [ModuleTypeEnum.Footer]: 'Footer Module',
  [ModuleTypeEnum.Spacer]: 'Spacer Module',
};

export const MaxModuleInEdmDesign: Record<Partial<ModuleType>, number> = {
  [ModuleTypeEnum.Header]: 1,
  [ModuleTypeEnum.Footer]: 1,
};

export const DefaultDesignConfig: EdmDesignConfig = {
  id: '',
  name: 'Untitled',
  photo: '',
  modules: [],
  backgroundColor: '#ffffff',
  contentWidth: 700,
  font: 'Roboto, sans-serif',
  themeName: 'Default',
};
