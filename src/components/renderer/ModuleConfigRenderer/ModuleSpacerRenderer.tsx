import { ColorPicker, Form, FormItem, Slider } from '@uikits';
import { debounce, merge } from 'lodash';
import { memo, useCallback } from 'react';

interface ModuleSpacerRendererProps {
  config: ModuleSpacer;
  id: string;
  min?: number;
  max?: number;
  step?: number;
  onChange?(data: ModuleSpacer): void;
}

function tipFormatter(value?: number) {
  return value ? `${value}px` : '';
}

export const ModuleSpacerRenderer = memo<ModuleSpacerRendererProps>((props) => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleFormChange = useCallback(
    debounce((_, allValues: ModuleText) => {
      let newValues = {};
      merge(newValues, props.config, allValues);

      props.onChange?.(newValues as ModuleSpacer);
    }, 0),
    [props.onChange, props.config]
  );

  return (
    <Form layout="vertical" onValuesChange={handleFormChange} initialValues={props.config}>
      <FormItem label={`Spacer Height (${props.config.height}px)`} name="height">
        <Slider
          min={props.min}
          max={props.max}
          step={props.step}
          tipFormatter={tipFormatter}
          range={false}
        />
      </FormItem>
      <FormItem label="Background Color" name="backgroundColor">
        <ColorPicker id={props.id} name="backgroundColor" clearable />
      </FormItem>
    </Form>
  );
});
