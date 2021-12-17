// import from antd because this component will be imported in UIKits
import Radio, { RadioChangeEvent } from 'antd/lib/radio';
import React, { memo } from 'react';
import styled from 'styled-components';

interface IconSelectionProps {
  options: {
    icon?: React.ReactNode;
    value: string;
    label?: string;
  }[];
  defaultValue?: string;
  onChange?(e: RadioChangeEvent): void;
  className?: string;
  value?: string;
}

const RadioGroupWrapper = styled(Radio.Group)`
  .ant-radio-button-wrapper {
    height: auto;
    padding: 0.5rem 1rem;
  }
`;

const ButtonContent = styled.span`
  display: flex;
  align-items: center;
`;

export const IconSelection = memo<IconSelectionProps>((props) => {
  return (
    <RadioGroupWrapper
      buttonStyle="solid"
      onChange={props.onChange}
      defaultValue={props.value}
      className={props.className}
    >
      {props.options.map((item) => (
        <Radio.Button key={item.value} value={item.value}>
          <ButtonContent>
            {item.icon && <span>{item.icon}</span>}
            {item.label && item.icon && <span>&nbsp;&nbsp;</span>}
            {item.label && <span>{item.label}</span>}
          </ButtonContent>
        </Radio.Button>
      ))}
    </RadioGroupWrapper>
  );
});
