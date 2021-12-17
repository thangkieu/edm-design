import { ModuleTypeEnum } from '@app/enums';
import { Error } from '@components/Error';
import { singleDesignModuleSelector } from '@recoil-atoms/selectors';
import { ForwardedRef } from 'hoist-non-react-statics/node_modules/@types/react';
import { memo, useMemo, forwardRef, useEffect, useRef, useCallback } from 'react';
import { useRecoilState } from 'recoil';
import { renderModule } from './helpers';
import { ModuleImageUIRendererRef } from './ModuleImageUI';
import { ModuleUIRendererHasTextRef } from './ModuleUIRendererHasText';

interface ModuleUIRendererProps {
  moduleConfig: ModuleConfig;
  wrapperRef?: ForwardedRef<HTMLDivElement | null>;
  onChange(data: RecursivePartial<ModuleConfig>): void;
}

const ModuleUIRenderer = memo<ModuleUIRendererProps>(({ moduleConfig, wrapperRef }) => {
  const htmlStr = useMemo(() => {
    return renderModule(moduleConfig);
  }, [moduleConfig]);

  if (!moduleConfig) return null;

  return (
    <div ref={wrapperRef} id={moduleConfig.id} dangerouslySetInnerHTML={{ __html: htmlStr }} />
  );
});

const ModuleUIRendererRef = forwardRef<HTMLDivElement | null, ModuleUIRendererProps>(
  (props, ref) => {
    return <ModuleUIRenderer {...props} wrapperRef={ref} />;
  }
);

export const ModuleUIRendererConnector = memo<{ moduleId: string }>(({ moduleId }) => {
  const [moduleConfig, updateModuleConfig] = useRecoilState(singleDesignModuleSelector(moduleId));
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  const handleClick = useCallback(
    (e: MouseEvent) => {
      document.dispatchEvent(new CustomEvent<string>('module-clicked', { detail: moduleId }));
    },
    [moduleId]
  );

  useEffect(() => {
    const wrapperEl = wrapperRef.current;
    wrapperEl?.addEventListener('click', handleClick);

    return () => {
      wrapperEl?.removeEventListener('click', handleClick);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [handleClick]);

  if (!moduleConfig) return <Error message="Cannot find module details" />;

  switch (moduleConfig.type) {
    case ModuleTypeEnum.Text:
    case ModuleTypeEnum.Header:
    case ModuleTypeEnum.Footer:
    case ModuleTypeEnum.ImageText:
      return (
        <ModuleUIRendererHasTextRef
          ref={wrapperRef}
          moduleConfig={moduleConfig}
          onChange={updateModuleConfig as any}
        />
      );

    case ModuleTypeEnum.Image:
      return (
        <ModuleImageUIRendererRef
          ref={wrapperRef}
          moduleConfig={moduleConfig}
          onChange={updateModuleConfig as any}
        />
      );

    default:
      return (
        <ModuleUIRendererRef
          ref={wrapperRef}
          moduleConfig={moduleConfig}
          onChange={updateModuleConfig as any}
        />
      );
  }
});
