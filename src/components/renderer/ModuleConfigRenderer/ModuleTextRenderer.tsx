import { TinyEditorRef } from '@components/Editor';
import { ColorPicker, Form, FormItem, PhotoSelection } from '@uikits';
import { uuidv4 } from '@utils/helpers';
import { FormInstance } from 'antd/es/form/Form';
import debounce from 'lodash/debounce';
import merge from 'lodash/merge';
import { memo, useCallback, useEffect, useMemo, useRef } from 'react';

interface ModuleTextRendererProps {
  config: ModuleText;
  id: string;
  children?: React.ReactNode;
  onChange?(data: RecursivePartial<ModuleText>): void;
}

export const ModuleTextFields = memo<ModuleTextRendererProps>(({ onChange, ...props }) => {
  const handleUploaded = useCallback(
    (url: string) => {
      if (!url) return;

      onChange?.({
        textStyle: {
          backgroundImage: url,
        },
        uploadedImages: [
          ...(props.config.uploadedImages ?? []),
          {
            id: uuidv4(),
            thumbnail: url,
            image: url,
            type: 'uploaded',
          },
        ],
      } as RecursivePartial<ModuleText>);
    },
    [onChange, props.config.uploadedImages]
  );

  const handleRemoveUploaded = useCallback(
    (id: string) => {
      if (!id) return;
      const removeItem = (props.config.uploadedImages ?? []).find((i) => i.id !== id);

      onChange?.({
        textStyle: {
          backgroundImage:
            props.config.textStyle.backgroundImage === removeItem?.image
              ? ''
              : props.config.textStyle.backgroundImage,
        },
        uploadedImages: (props.config.uploadedImages ?? []).filter((i) => i.id !== id),
      } as RecursivePartial<ModuleText>);
    },
    [onChange, props.config.textStyle.backgroundImage, props.config.uploadedImages]
  );

  const backgroundImages = useMemo(
    () => [...(props.config.defaultImages ?? []), ...(props.config.uploadedImages ?? [])],
    [props.config.defaultImages, props.config.uploadedImages]
  );

  return (
    <>
      <FormItem label="Text" name="text">
        <TinyEditorRef id={props.id} placeholder={props.config.textPlaceholder} />
      </FormItem>

      <FormItem label="Text Color" name={['textStyle', 'color']}>
        <ColorPicker id={props.id} name="textStyle.color" clearable />
      </FormItem>

      <FormItem label="Background Color" name="backgroundColor">
        <ColorPicker id={props.id} name="backgroundColor" clearable />
      </FormItem>

      <FormItem label={'Background Image'} name={['textStyle', 'backgroundImage']}>
        <PhotoSelection
          hasNone
          id={props.id}
          name="textStyle.backgroundImage"
          images={backgroundImages}
          onUploaded={handleUploaded}
          onRemoveUploaded={handleRemoveUploaded}
        />
      </FormItem>
    </>
  );
});

export const ModuleTextRenderer = memo<Omit<ModuleTextRendererProps, 'onUploaded'>>(
  ({ onChange, ...props }) => {
    const formRef = useRef<FormInstance>(null);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const handleFormChange = useCallback(
      debounce((_, allValues: ModuleText) => {
        // TODO: Remove merge function, because ModuleConfigRenderer is handling deep merge
        let newValues = {};
        merge(newValues, props.config, allValues);

        onChange?.(newValues as ModuleText);
      }, 0),
      [onChange, props.config]
    );

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
        <ModuleTextFields config={props.config} id={props.id} onChange={onChange} />
      </Form>
    );
  }
);
