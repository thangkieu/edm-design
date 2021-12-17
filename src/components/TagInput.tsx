import { PlusOutlined } from '@icons';
import { Input, Tag } from '@uikits';
import { memo, useCallback, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

const TagStyle = styled(Tag)`
  margin-bottom: 0.5rem;
  padding-top: 1px;
  padding-bottom: 1px;
`;

const InputStyle = styled(Input)`
  display: inline-block;
  width: auto;
  margin-right: 8px;
  margin-bottom: 7px;
`;

interface TagInputProps {
  val?: string;
  label?: string;
  index: number;
  color?: string;
  onAdd(value: string, index: number): void;
  onRemove?(index: number): void;
}

const TagInput = memo<TagInputProps>(({ val, color, label, index, onAdd, onRemove }) => {
  const inputRef = useRef<any>(null);
  const [showInput, toggleShowInput] = useState(false);
  const [width, setWidth] = useState<number>();

  const getRef = useCallback((ref) => {
    inputRef.current = ref;
  }, []);

  const handleToggleShowInput = useCallback(() => {
    toggleShowInput(!showInput);
  }, [showInput]);

  const handleShowInput = useCallback<React.MouseEventHandler<HTMLSpanElement>>(
    (e) => {
      // (e.currentTarget as any).style.width = `${e.currentTarget.getBoundingClientRect().width}px`;
      setWidth(e.currentTarget.getBoundingClientRect().width);
      toggleShowInput(!showInput);
    },
    [showInput]
  );

  const handleSubmit = useCallback<React.KeyboardEventHandler<HTMLInputElement>>(
    (e) => {
      const value = e.currentTarget.value;
      if (!value) return;

      handleToggleShowInput();

      onAdd(value, index);
    },
    [onAdd, index, handleToggleShowInput]
  );

  const handleRemove = useCallback(() => {
    onRemove?.(index);
  }, [onRemove, index]);

  useEffect(() => {
    if (showInput) {
      inputRef.current?.focus();
    }
  }, [showInput]);

  if (showInput) {
    return (
      <InputStyle
        style={{ width: width }}
        ref={getRef}
        type="text"
        size="small"
        defaultValue={val}
        onBlur={handleToggleShowInput}
        onPressEnter={handleSubmit}
      />
    );
  }

  return (
    <TagStyle
      color={color}
      onClick={handleShowInput}
      closable={Boolean(val)}
      onClose={handleRemove}
    >
      {val && val}
      {!val && (
        <>
          <PlusOutlined /> {label}
        </>
      )}
    </TagStyle>
  );
});

interface TagInputsProps {
  maxCount?: number;
  values?: string[];
  onChange?(values: string[]): void;
}

export const TagInputs = memo<TagInputsProps>(({ values: pvalues, maxCount, onChange }) => {
  const [values, setValues] = useState<string[]>(pvalues || []);

  const handleSubmit = useCallback(
    (value: string, index: number) => {
      let newValues = [...values];
      if (values.includes(value)) return;

      if (index === -1) {
        newValues = [...newValues, value];
      } else {
        newValues.splice(index, 1, value);
      }

      setValues(newValues);
    },
    [values]
  );

  const handleRemove = useCallback(
    (index: number) => {
      const newValues = [...values];

      newValues.splice(index, 1);

      setValues(newValues);
    },
    [values]
  );

  useEffect(() => {
    onChange?.(values);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values]);

  return (
    <>
      {values.map((val, idx) => (
        <TagInput
          color="blue"
          key={val}
          val={val}
          index={idx}
          onAdd={handleSubmit}
          onRemove={handleRemove}
        />
      ))}

      {((maxCount && values.length < maxCount) || !maxCount) && (
        <TagInput key={-1} index={-1} onAdd={handleSubmit} label="New Tag" />
      )}
    </>
  );
});
