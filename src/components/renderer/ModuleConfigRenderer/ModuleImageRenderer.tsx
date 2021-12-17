import { FormInstance } from 'antd/es/form/Form';
import { debounce, merge } from 'lodash';
import { memo, useCallback, useEffect, useMemo, useRef } from 'react';

import { ModuleTypeEnum } from '@app/enums';
import {
  AlignCenterOutlined,
  AlignLeftOutlined,
  AlignRightOutlined,
  CaptionImageIcon,
  IconBase,
  ImageCaptionIcon,
  PictureOutlined
} from '@icons';
import {
  ColorPicker,
  Form,
  FormItem,
  IconSelection,
  Input,
  InputNumber,
  UploadImage
} from '@uikits';

import { ModuleTextFields } from './ModuleTextRenderer';

interface ModuleImageRendererProps {
  config: ModuleImage | ModuleImageText;
  id: string;
  type?: ModuleTypeEnum.Image | ModuleTypeEnum.ImageText;
  onChange?(data: ModuleImage | ModuleImageText): void;
}

const LAYOUTS = [
  {
    value: 'left right',
    label: 'Text/Image',
    icon: <IconBase size="1.5rem" icon={CaptionImageIcon} />,
  },
  {
    value: 'right left',
    label: 'Image/Text',
    icon: <IconBase size="1.5rem" icon={ImageCaptionIcon} />,
  },
];

const IMAGE_FIT = [
  {
    value: 'fill',
    label: 'Fill Box ratio',
    icon: <PictureOutlined />,
  },
  {
    value: 'contain',
    label: 'Image ratio',
    icon: <PictureOutlined />,
  },
];

const ALIGNMENTS = [
  {
    value: 'left',
    icon: <AlignLeftOutlined />,
  },
  {
    value: 'center',
    icon: <AlignCenterOutlined />,
  },
  {
    value: 'right',
    icon: <AlignRightOutlined />,
  },
];

export const ModuleImageRenderer = memo<ModuleImageRendererProps>((props) => {
  const formRef = useRef<FormInstance>(null);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleFormChange = useCallback(
    debounce((_, allValues: ModuleText) => {
      let newValues = {};
      merge(newValues, props.config, allValues);

      props.onChange?.(newValues as ModuleImage | ModuleImageText);
    }, 0),
    [props.onChange, props.config]
  );

  const hasTextModule = useMemo(() => props.type === ModuleTypeEnum.ImageText, [props.type]);

  useEffect(() => {
    formRef.current?.setFieldsValue(props.config);
  }, [props.config]);

  return (
    <Form
      ref={formRef}
      layout="vertical"
      onValuesChange={handleFormChange}
      initialValues={props.config}
    >
      {hasTextModule && (
        <FormItem label="Layout" name={['imgConfig', 'layout']}>
          <IconSelection options={LAYOUTS} />
        </FormItem>
      )}

      <FormItem name={['imgConfig', 'src']} label="Upload Image">
        <UploadImage />
      </FormItem>

      {!hasTextModule && (
        <FormItem label="Image Height" name={['imgConfig', 'height']}>
          <InputNumber step={50} />
        </FormItem>
      )}

      <FormItem name={['imgConfig', 'caption']} label="Image Caption">
        <Input />
      </FormItem>

      <FormItem label="Caption Alignment" name={['imgConfig', 'captionAlign']}>
        <IconSelection options={ALIGNMENTS} />
      </FormItem>

      <FormItem label="Image Border Color" name={['imgConfig', 'borderColor']}>
        <ColorPicker id={props.id} name="imageBorderColor" clearable />
      </FormItem>

      <FormItem label="Image Displaying" name={['imgConfig', 'displaying']}>
        <IconSelection options={IMAGE_FIT} />
      </FormItem>

      <FormItem label="Set URL" name={['imgConfig', 'link']}>
        <Input placeholder="https://example.com" />
      </FormItem>

      {hasTextModule && (
        <ModuleTextFields config={props.config} id={props.id} onChange={props.onChange} />
      )}
    </Form>
  );
});
