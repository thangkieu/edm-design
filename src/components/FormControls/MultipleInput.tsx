import { Tag } from '@uikits';
import { FormItemProps } from 'antd/lib/form/FormItem';
import React, { FC, memo, useCallback, useState } from 'react';
import styled, { css } from 'styled-components';
import { PatternType, validateBy } from '../../utils/helpers';

const KEYS_SEPARATOR = ['Enter', ',', ' '];
interface InputProps extends FormItemProps {
  placeholder?: string;
  defaultItems?: string[];
  pattern?: PatternType;
  label?: string;
  onChange?(payload: string[]): void;
}

const InputStyle = styled.div<{ appearance?: FormItemProps['validateStatus'] }>`
  padding: 0.5em 0.5em 0 0.5em;
  outline: none;
  display: flex;
  flex-wrap: wrap;
  min-height: 71px;
  align-items: flex-start;
  background-color: white;

  ${(p) =>
    p.appearance &&
    css`
      border-color: ${p.theme.colors[p.appearance]};
    `}

  &:focus {
    border-color: ${(p) => p.theme.colors.primary};
    box-shadow: 0 0 0 2px #1890ff33;
  }
`;
const InputCursor = styled.span<Pick<InputProps, 'placeholder'>>`
  line-height: 1.3;
  padding: 0.2em 0.5em;
  outline: none;
  flex-grow: 1;
  margin-bottom: 0.5em;

  ${(p) =>
    p.placeholder &&
    css`
      position: relative;

      &:empty::before {
        content: '${p.placeholder}';
        color: #898989;
        z-index: -1;
      }
    `}
`;

const TagItem = styled(Tag)`
  margin-bottom: 0.5rem;
`;

const TagItemComponent = memo<{ value: string; onRemove?(value: string): void }>(
  ({ value, onRemove }) => {
    const handleRemove = useCallback(() => {
      onRemove?.(value);
    }, [onRemove, value]);

    return (
      <TagItem
        closable
        data-value={value}
        onClose={handleRemove}
        color={validateBy('email', value) ? '' : 'red'}
      >
        {value}
      </TagItem>
    );
  }
);

export const MultipleInput: FC<InputProps> = memo(
  ({ onChange, defaultItems, pattern, placeholder, ...props }) => {
    const [selectedItems, setSelectedItems] = useState(defaultItems);
    const [error, setError] = useState('');

    const validateValue = useCallback(
      (value: string) => {
        if (pattern && !validateBy(pattern, value)) {
          setError(`"${value}" is invalid.`);
          return false;
        }

        return true;
      },
      [pattern]
    );

    const updateItems = useCallback(
      (items) => {
        setSelectedItems(items);
        onChange?.(items);
      },
      [onChange]
    );

    const handleKeyDown: React.KeyboardEventHandler<HTMLSpanElement> = useCallback(
      (event) => {
        const value: string = event.currentTarget.textContent || '';
        if (error) setError('');

        if (event.key === 'Backspace' && !value && selectedItems && selectedItems.length > 0) {
          // remove latest item
          updateItems(selectedItems.slice(0, selectedItems.length - 1));

          return;
        }

        // add new item
        if (!KEYS_SEPARATOR.includes(event.key)) return;

        event.preventDefault();

        // validate
        if (!validateValue(value)) return;

        const newSelectedItems = selectedItems || [];

        if (newSelectedItems.indexOf(value) > -1) return;

        updateItems([...newSelectedItems, value]);

        event.currentTarget.innerHTML = '';
      },
      [selectedItems, error, validateValue, updateItems]
    );

    const handleRemove = useCallback(
      (valueToRemove: string) => {
        if (!selectedItems || selectedItems.length === 0) return;

        updateItems(selectedItems.filter((i) => i !== valueToRemove));
      },
      [updateItems, selectedItems]
    );

    const handlePaste = useCallback(
      (e: React.ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        const data = e.clipboardData.getData('text');
        let [separator] = [',', '\n', ';'].filter((i) => data.includes(i));

        const validItems = pattern
          ? data.split(separator).filter((i) => validateBy(pattern, i))
          : data.split(separator).filter((i) => i);

        updateItems(validItems);
      },
      [pattern, updateItems]
    );

    return (
      <>
        <InputStyle className="ant-input">
          {selectedItems?.map((item) => (
            <TagItemComponent key={item} value={item} onRemove={handleRemove} />
          ))}
          <InputCursor
            placeholder={selectedItems && selectedItems.length > 0 ? '' : placeholder}
            contentEditable
            onKeyDown={handleKeyDown}
            onPaste={handlePaste}
          />
        </InputStyle>
      </>
    );
  }
);

MultipleInput.defaultProps = {};
