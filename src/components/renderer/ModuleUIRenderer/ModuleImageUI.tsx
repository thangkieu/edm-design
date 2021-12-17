import { ForwardedRef } from 'hoist-non-react-statics/node_modules/@types/react';

import { forwardRef, memo, useCallback, useEffect, useMemo, useRef } from 'react';
import { renderModule } from './helpers';

interface ModuleUIRendererProps {
  moduleConfig: ModuleImageConfig;
  wrapperRef?: ForwardedRef<HTMLDivElement | null>;
  onChange(data: RecursivePartial<ModuleConfig>): void;
}

const ModuleImageUIRenderer = memo<ModuleUIRendererProps>(
  ({ moduleConfig, wrapperRef, onChange }) => {
    const elRef = useRef<HTMLDivElement | null>(null);
    const htmlStr = useMemo(() => renderModule(moduleConfig), [moduleConfig]);

    const handleImageLoaded = useCallback(
      (e: HTMLElementEventMap['load']) => {
        const el = e.currentTarget as HTMLImageElement;
        const height = el.offsetHeight;

        onChange({ config: { imgConfig: { height } } } as RecursivePartial<ModuleImageConfig>);
      },
      [onChange]
    );

    const handleGetRef = useCallback(
      (ref: HTMLDivElement) => {
        elRef.current = ref;

        if (wrapperRef) (wrapperRef as any).current = ref;
      },
      [wrapperRef]
    );

    useEffect(() => {
      const img = elRef.current?.querySelector('img:not([aria-img-placeholder])');
      img?.addEventListener('load', handleImageLoaded);

      return () => {
        img?.removeEventListener('load', handleImageLoaded);
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [moduleConfig.config.imgConfig?.src]);

    if (!moduleConfig) return null;

    return (
      <div ref={handleGetRef} id={moduleConfig.id} dangerouslySetInnerHTML={{ __html: htmlStr }} />
    );
  }
);

export const ModuleImageUIRendererRef = forwardRef<HTMLDivElement | null, ModuleUIRendererProps>(
  (props, ref) => {
    return <ModuleImageUIRenderer {...props} wrapperRef={ref} />;
  }
);
