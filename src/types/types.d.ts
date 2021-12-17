type ModuleType = ModuleTypeEnum[number];
type ModuleImageLayout = 'left right' | 'right left';
type ImageFitType = 'fill' | 'contain';
type Alignment = 'left' | 'center' | 'right';

type RecursivePartial<T> = {
  [P in keyof T]?: RecursivePartial<T[P]>;
};

type ModuleTextStyle = {
  color: string;
  fontSize: string;
  weight: 'bold' | 'normal';
  padding: string;
  backgroundImage?: string;
};

type BackgroundItem = {
  id: string;
  thumbnail: string;
  image: string;
  type?: 'uploaded';
};

type ModuleText = {
  id: string;
  text: string;
  textPlaceholder?: string;
  backgroundColor: string;
  imageUrl: string;
  imageFile?: File;
  textStyle: ModuleTextStyle;
  defaultImages: BackgroundItem[];
  uploadedImages: BackgroundItem[];
  textMaxLength?: number;
};

type ModuleImage = ModuleText & {
  link: string;
  imageFit: ImageFitType;
  imgConfig?: {
    link?: string;
    src?: string;
    maxHeight?: number;
    height?: number;
    layout?: Alignment;
    captionAlign?: Alignment;
    caption?: string;
    borderColor?: string;
  };
};

type ModuleImageText = ModuleImage & {
  layout: ModuleImageLayout;
};

type ModuleSpacer = {
  id: string;
  height: number;
  backgroundColor: string;
};

type ModuleDetails = ModuleText | ModuleImage | ModuleSpacer | ModuleImageText;

type BaseModuleConfig = {
  id: string;
  key?: string;
  type: ModuleTypeEnum;
  template: string;
  // config: ModuleDetails;
};

type ModuleTextConfig = BaseModuleConfig & {
  type: ModuleTypeEnum.Text;
  config: ModuleText;
};

type ModuleHeaderConfig = BaseModuleConfig & {
  type: ModuleTypeEnum.Header;
  config: ModuleText;
};

type ModuleFooterConfig = BaseModuleConfig & {
  type: ModuleTypeEnum.Footer;
  config: ModuleText;
};

type ModuleImageConfig = BaseModuleConfig & {
  type: ModuleTypeEnum.Image;
  config: ModuleImage;
};

type ModuleImageTextConfig = BaseModuleConfig & {
  type: ModuleTypeEnum.ImageText;
  config: ModuleImageText;
};

type ModuleSpacerConfig = BaseModuleConfig & {
  type: ModuleTypeEnum.Spacer;
  config: ModuleSpacer;
};

type ModuleConfigHasText =
  | ModuleTextConfig
  | ModuleImageTextConfig
  | ModuleHeaderConfig
  | ModuleFooterConfig;

type ModuleConfig = ModuleConfigHasText | ModuleImageConfig | ModuleSpacerConfig;

type EdmDesignConfig = {
  id: string;
  name: string;
  photo: string;
  backgroundColor: string;
  contentWidth: number;
  modules: ModuleConfig[];
  font?: string;
  themeName: string;
  thumbnail?: string;
};

type RouteConfig = {
  path: string;
  exact: boolean;
  component: any;
  auth?: boolean;
};

type ModuleCollection = Record<string, ModuleConfig>;
type EdmDesignCollection = Record<string, EdmDesignConfig>;

type ModuleOrderItem = {
  id: string;
  label: string;
  type: ModuleType;
};

type SelectOption = {
  value: string;
  label: string;
};

type SavedDesignHistoryItem = {
  label: string;
  designConfig: EdmDesignConfig;
  thumb?: string;
  htmlFileKey?: string;
};

type SavedDesignHistory = Record<string, SavedDesignHistoryItem>;

type SendEmailForm = {
  subject: string;
  emails: string[];
  replyTo?: string;
};

type FileRespItem = {
  key: string;
  file: string;
};

type SendEmailBody = {
  html_file_key?: string;
  message?: string;
  subject: string;
  receivers: string[];
  sender: string;
};
