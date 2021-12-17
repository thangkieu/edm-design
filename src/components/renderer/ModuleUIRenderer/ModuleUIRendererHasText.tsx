import { Editor, renderTinyMce } from '@utils/tinymce';
import { ForwardedRef } from 'hoist-non-react-statics/node_modules/@types/react';
import { cloneDeep } from 'lodash';
import objectHash from 'object-hash';
import { forwardRef, memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { hasText, renderModule } from './helpers';

interface ModuleUIRendererProps {
  moduleConfig: ModuleConfigHasText;
  wrapperRef?: ForwardedRef<HTMLDivElement | null>;
  onChange(data: RecursivePartial<ModuleConfig>): void;
}

export const ModuleUIRendererHasText = memo<ModuleUIRendererProps>(
  ({ moduleConfig, wrapperRef, onChange }) => {
    const tinymceRef = useRef<Editor | null>();
    const wrapperElRef = useRef<HTMLDivElement>();
    const [htmlStr, setHtmlStr] = useState(renderModule(moduleConfig));

    const hash = useMemo(() => {
      const config = cloneDeep(moduleConfig);
      delete (config as any).config.text;

      return objectHash(config);
    }, [moduleConfig]);

    const textStr = useMemo(() => {
      if (hasText(moduleConfig.type)) {
        return moduleConfig.config.text;
      }

      return '';
    }, [moduleConfig]);

    const handleChange = useCallback(() => {
      const text = tinymceRef.current?.getContent();

      if (text) onChange({ config: { text } });
    }, [onChange]);

    const handleGetRef = useCallback(
      (ref: HTMLDivElement) => {
        wrapperElRef.current = ref;

        if (wrapperRef) (wrapperRef as any).current = ref;
      },
      [wrapperRef]
    );

    useEffect(() => {
      if (!tinymceRef.current?.hasFocus()) tinymceRef.current?.setContent(textStr || '');
    }, [textStr]);

    useEffect(() => {
      if (!tinymceRef.current) return;

      setHtmlStr(renderModule(moduleConfig));
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [hash]);

    useEffect(() => {
      async function initTinyMce() {
        const el = wrapperElRef.current?.querySelector<HTMLDivElement>('.block-text');
        if (!el) {
          return Promise.reject();
        }

        const ins = await renderTinyMce(el, moduleConfig.config.textPlaceholder);

        if (ins?.length > 0) {
          tinymceRef.current = ins[0];
          tinymceRef.current.on('input', handleChange);
          tinymceRef.current.on('change', handleChange);
        }
      }

      if (!tinymceRef.current) {
        initTinyMce();
      }

      return () => {
        tinymceRef.current?.off('input', handleChange);
        tinymceRef.current?.off('change', handleChange);
        tinymceRef.current?.destroy();
        tinymceRef.current = null;
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [htmlStr]);

    if (!moduleConfig) return null;

    return (
      <div ref={handleGetRef} style={{ textUnderlineOffset: 2 }} id={moduleConfig.id}>
        <div dangerouslySetInnerHTML={{ __html: htmlStr }} />
      </div>
    );
  }
);

export const ModuleUIRendererHasTextRef = forwardRef<HTMLDivElement | null, ModuleUIRendererProps>(
  (props, ref) => {
    return <ModuleUIRendererHasText {...props} wrapperRef={ref} />;
  }
);
