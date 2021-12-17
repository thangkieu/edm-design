// import from antd because this component will be imported in UIKits
import Input from 'antd/lib/input';
import { memo, useMemo } from 'react';
import styled from 'styled-components';

interface ColorPickerProps {
  id: string;
  onChange?: any;
  value?: string;
  name?: string;
  clearable?: boolean;
}

const InputWrap = styled.div`
  display: flex;
  position: relative;

  [type='color'] {
    opacity: 0;
    position: absolute;
    bottom: 0;
    left: 0;
  }
`;

const ColorShowing = styled.label`
  display: block;
  width: 2.7em;
  background-color: white;
  border: 1px solid #ddd;
  border-right: 0;
`;

export const ColorPicker = memo<ColorPickerProps>((props) => {
  const value = useMemo(() => props.value || '', [props.value]);

  return (
    <InputWrap>
      <input
        id={`${props.id}-${props.name}`}
        type="color"
        value={value}
        onChange={props.onChange}
      />

      <ColorShowing htmlFor={`${props.id}-${props.name}`} style={{ backgroundColor: value }} />

      <Input value={value} onChange={props.onChange} allowClear={props.clearable} />
    </InputWrap>
  );
});
