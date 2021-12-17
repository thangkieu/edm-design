import { memo } from 'react';
import styled from 'styled-components';
// Antd Icones, please declare the icons of Antd Design we are using
// DO NOT import icon like this: import { Icon } from 'antd';
export { default as AlignCenterOutlined } from '@ant-design/icons/AlignCenterOutlined';
export { default as AlignLeftOutlined } from '@ant-design/icons/AlignLeftOutlined';
export { default as AlignRightOutlined } from '@ant-design/icons/AlignRightOutlined';
export { default as BgColorsOutlined } from '@ant-design/icons/BgColorsOutlined';
export { default as CheckCircleTwoTone } from '@ant-design/icons/CheckCircleTwoTone';
export { default as CloseOutlined } from '@ant-design/icons/CloseOutlined';
export { default as CloudDownloadOutlined } from '@ant-design/icons/CloudDownloadOutlined';
export { default as CloudUploadOutlined } from '@ant-design/icons/CloudUploadOutlined';
export { default as CopyOutlined } from '@ant-design/icons/CopyOutlined';
export { default as DeleteOutlined } from '@ant-design/icons/DeleteOutlined';
export { default as DisconnectOutlined } from '@ant-design/icons/DisconnectOutlined';
export { default as DragOutlined } from '@ant-design/icons/DragOutlined';
export { default as EditOutlined } from '@ant-design/icons/EditOutlined';
export { default as FileImageOutlined } from '@ant-design/icons/FileImageOutlined';
export { default as FileOutlined } from '@ant-design/icons/FileOutlined';
export { default as InboxOutlined } from '@ant-design/icons/InboxOutlined';
export { default as LoadingOutlined } from '@ant-design/icons/LoadingOutlined';
export { default as LogoutOutlined } from '@ant-design/icons/LogoutOutlined';
export { default as MailOutlined } from '@ant-design/icons/MailOutlined';
export { default as PictureOutlined } from '@ant-design/icons/PictureOutlined';
export { default as PlusCircleOutlined } from '@ant-design/icons/PlusCircleOutlined';
export { default as PlusOutlined } from '@ant-design/icons/PlusOutlined';
export { default as UserOutlined } from '@ant-design/icons/UserOutlined';
// Those icons are used for available edm theme modules
export { ReactComponent as BlankIcon } from '../icons/blank.svg';
export { ReactComponent as CaptionImageIcon } from '../icons/caption-image.svg';
export { ReactComponent as DocsIcon } from '../icons/docs.svg';
export { ReactComponent as FooterIcon } from '../icons/footer.svg';
export { ReactComponent as HeaderIcon } from '../icons/header.svg';
export { ReactComponent as ImageCaptionIcon } from '../icons/image-caption.svg';
export { default as fallbackImg, ReactComponent as ImageIcon } from '../icons/image.svg';
export { ReactComponent as SpacerIcon } from '../icons/spacer.svg';
export { ReactComponent as TextIcon } from '../icons/text.svg';

// TODO: remove this
const FONT_SIZES = {
  md: '2rem',
  lg: '4rem',
  sm: '1rem',
};

const IconStyled = styled.span<{
  size?: Partial<keyof typeof FONT_SIZES>;
}>`
  font-size: ${({ size }) => (size ? FONT_SIZES[size] || size : size)};

  svg {
    display: block;
    height: 1em;
    width: 1em;
    font-size: inherit;
  }
`;

export const IconBase = memo<{
  icon: any;
  className?: string;
  size?: Partial<keyof typeof FONT_SIZES> | string;
}>(({ icon: Icon, size, className }) => {
  return (
    <IconStyled className={className} size={size as any}>
      <Icon />
    </IconStyled>
  );
});
