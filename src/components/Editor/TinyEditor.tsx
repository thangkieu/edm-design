import { renderTinyMce } from '@utils/tinymce';
import { memo, useCallback, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { Editor as TinyMceEditor } from 'tinymce';

export interface TinyEditorProps {
  ref?: any;
  onChange?: React.EventHandler<any>;
  placeholder?: string;
  value?: string;
  id?: string;
}

const Wrapper = styled.div`
  min-height: 10rem;
  outline: 1px solid #dddddd;

  [aria-placeholder] {
    overflow: hidden;
  }

  * {
    max-width: 100%;
  }
`;

const TinyEditor = memo<TinyEditorProps>(({ onChange, placeholder, value }) => {
  const tinymceRef = useRef<TinyMceEditor | null>();
  const wrapperElRef = useRef<HTMLDivElement>();

  const handleChange = useCallback(() => {
    onChange?.(tinymceRef.current?.getContent());
  }, [onChange]);

  useEffect(() => {
    if (!wrapperElRef.current) return;

    async function initTinyMce(el: HTMLElement) {
      if (!el) return;

      const ins = await renderTinyMce(el, placeholder);

      if (ins?.length > 0) {
        tinymceRef.current = ins[0];
        tinymceRef.current.setContent(value || '');
        tinymceRef.current.on('input', handleChange);
        tinymceRef.current.on('change', handleChange);
      }
    }

    if (!tinymceRef.current) {
      initTinyMce(wrapperElRef.current);
    }

    return () => {
      tinymceRef.current?.off('input', handleChange);
      tinymceRef.current?.off('change', handleChange);
      tinymceRef.current?.destroy();
      tinymceRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (value !== tinymceRef.current?.getContent() && !tinymceRef.current?.hasFocus())
      tinymceRef.current?.setContent(value || '');
  }, [value]);

  return <Wrapper ref={wrapperElRef as any} />;
});

export default TinyEditor;
