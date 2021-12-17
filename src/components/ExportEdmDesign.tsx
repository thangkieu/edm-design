import { CloudDownloadOutlined } from '@icons';
import { designConfigState } from '@recoil-atoms/atoms';
import { designModulesConfigInOrderSelector } from '@recoil-atoms/selectors';
import { Button, Space } from '@uikits';
import { removeKeys } from '@utils/helpers';
import { saveAs } from 'file-saver';
import produce from 'immer';
import JSZip from 'jszip';
import { memo, useCallback, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { SendEmail } from './Forms/SendEmail';
import { renderModule } from './renderer/ModuleUIRenderer';

interface ExportEdmDesignProps {}

export function getHTML(designConfig: EdmDesignConfig, transformImgToS3Url?: boolean) {
  let htmlStr = designConfig.modules
    .map((item) => renderModule(item, transformImgToS3Url))
    .join('');

  htmlStr = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
    <html xmlns="http://www.w3.org/1999/xhtml">
      <head>
        <meta charset="utf-8"/>
        <title>${designConfig.name}</title>
        <style>
          img {
            max-width: 100%;
            max-height: 100%;
            height: auto !important;  
          }
        </style>
      </head>
      <body style="margin: auto;padding: 16px; max-width: ${designConfig.contentWidth}px; background-color: ${designConfig.backgroundColor}; font-family: ${designConfig.font}">
        <style>
          img {
            max-width: 100%;
            max-height: 100%;
            height: auto !important;  
          }
        </style>
        ${htmlStr}
      </body>
    </html>`;

  return htmlStr;
}

export const ExportEdmDesign = memo<ExportEdmDesignProps>(() => {
  const currentModuleList = useRecoilValue(designModulesConfigInOrderSelector);
  const designConfig = useRecoilValue(designConfigState);
  const [isExporting, toggleExporting] = useState(false);

  const handleClick = useCallback(async () => {
    if (!designConfig) return;
    toggleExporting(true);

    const zip = new JSZip();
    const fileName = designConfig.name.toLocaleLowerCase().replaceAll(' ', '-');

    const mergedConfig: EdmDesignConfig = produce(
      {
        ...designConfig,
        modules: currentModuleList,
      },
      (draft) => {
        removeKeys(draft, ['key']);
      }
    );

    let htmlStr = getHTML(mergedConfig);

    toggleExporting(false);
    zip.file(`${fileName}.html`, htmlStr);
    zip.file(`${fileName}.json`, JSON.stringify(mergedConfig));

    zip.generateAsync({ type: 'blob' }).then(function (content) {
      saveAs(content, `${fileName}.zip`);
    });
  }, [currentModuleList, designConfig]);

  return (
    <Space>
      <SendEmail />
      <Button
        type="primary"
        icon={<CloudDownloadOutlined />}
        disabled={
          !currentModuleList || currentModuleList.length === 0 || isExporting || !designConfig
        }
        loading={isExporting}
        onClick={handleClick}
      >
        Export to HTML
      </Button>
    </Space>
  );
});
