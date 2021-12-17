export enum ModuleTypeEnum {
  Text = 'text',
  Image = 'image',
  ImageText = 'image-text',
  Header = 'header',
  Footer = 'footer',
  Spacer = 'spacer',
}

export enum DroppableNames {
  DesignArea = 'design-area',
  AvailableModules = 'available-modules',
  ModuleConfigArea = 'module-config-area',
}
declare global {
  enum ModuleTypeEnum {
    Text = 'text',
    Image = 'image',
    ImageText = 'image-text',
    Header = 'header',
    Footer = 'footer',
    Spacer = 'spacer',
  }

  enum DroppableNames {
    DesignArea = 'design-area',
    AvailableModules = 'available-modules',
    ModuleConfigArea = 'module-config-area',
  }
}
