import { Error } from '@components/Error';
import { singleDesignModuleSelector } from '@recoil-atoms/selectors';
import { mergeDeep } from '@utils/helpers';
import React, { memo, useCallback, useMemo } from 'react';
import { useRecoilState } from 'recoil';
import { ModuleImageRenderer } from './ModuleImageRenderer';
import { ModuleSpacerRenderer } from './ModuleSpacerRenderer';
import { ModuleTextRenderer } from './ModuleTextRenderer';

interface ModuleConfigRendererProps {
  moduleConfig: ModuleConfig;
  updateDesignModule(moduleConfig: ModuleConfig): void;
}

const ModuleConfigRenderer = memo<ModuleConfigRendererProps>(
  ({ moduleConfig, updateDesignModule }) => {
    const handleChange = useCallback(
      (data: ModuleDetails) => {
        updateDesignModule(mergeDeep({}, moduleConfig, { config: data as any }));
      },
      [moduleConfig, updateDesignModule]
    );

    const { content, error } = useMemo(() => {
      let content = null;

      switch (moduleConfig.type) {
        case 'text':
          content = (
            <ModuleTextRenderer
              config={moduleConfig.config}
              id={moduleConfig.id}
              onChange={handleChange}
            />
          );
          break;

        case 'header':
          content = (
            <ModuleTextRenderer
              config={moduleConfig.config}
              id={moduleConfig.id}
              onChange={handleChange}
            />
          );
          break;

        case 'footer':
          content = (
            <ModuleTextRenderer
              config={moduleConfig.config}
              id={moduleConfig.id}
              onChange={handleChange}
            />
          );
          break;

        case 'image':
        case 'image-text':
          content = (
            <ModuleImageRenderer
              config={moduleConfig.config}
              id={moduleConfig.id}
              onChange={handleChange}
              type={moduleConfig.type}
            />
          );
          break;

        case 'spacer':
          content = (
            <ModuleSpacerRenderer
              config={moduleConfig.config}
              id={moduleConfig.id}
              onChange={handleChange}
              min={8}
              max={8 * 6}
              step={8}
            />
          );
          break;

        default:
          return { error: <Error message="Moudle is not support" /> };
      }

      return { content };
    }, [moduleConfig, handleChange]);

    if (error) {
      return error;
    }

    return <React.Fragment key={moduleConfig.key || moduleConfig.id}>{content}</React.Fragment>;
  }
);

export const ModuleConfigRendererConnect = memo<Pick<ModuleConfigRendererProps, 'moduleConfig'>>(
  ({ moduleConfig }) => {
    const [designModule, updateDesignModule] = useRecoilState(
      singleDesignModuleSelector(moduleConfig.id)
    );

    if (!designModule) return null;

    return (
      <ModuleConfigRenderer moduleConfig={designModule} updateDesignModule={updateDesignModule} />
    );
  }
);
