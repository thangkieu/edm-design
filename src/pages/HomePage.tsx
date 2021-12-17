import { DefaultDesignConfig } from '@app/constants';
import { CloudUploadOutlined } from '@components/Icons';
import { LayoutBasic } from '@components/Layout/Basic';
import { Profile } from '@components/Profile';
import {
  availModuleListFamilyState,
  currentDesignNameState,
  currentEdmThemeNameState,
  edmThemeListState,
  isLoadingState,
} from '@recoil-atoms/atoms';
import { edmThemeListSelector, replaceByDesignConfigSelector } from '@recoil-atoms/selectors';
import { getAllThemes, getThemeConfig } from '@services/themes';
import { Divider, Image, Typography, Upload } from '@uikits';
import { loadFile, preventUpload, uuidv4 } from '@utils/helpers';
import { notify } from '@utils/notification';
import { UploadChangeParam, UploadFile } from 'antd/lib/upload/interface';
import { memo, useCallback, useEffect } from 'react';
import { useHistory } from 'react-router';
import { useRecoilCallback, useRecoilValue, useSetRecoilState } from 'recoil';
import styled from 'styled-components';

const Box = styled.div`
  padding: ${(p) => p.theme.spacing.md};
  margin: 0 calc(${(p) => p.theme.spacing.sm} / 2) ${(p) => p.theme.spacing.sm};
  flex: 1 1 0%;
  appearance: none;
  background-color: white;
  border: 1px solid ${(p) => p.theme.colors.border};
  transition: all 0.3s ease-in-out;
  cursor: pointer;
  align-items: center;
  display: flex;
  flex-direction: column;

  &:hover {
    border-color: transparent;
    box-shadow: 0 0 20px -10px rgba(0, 0, 0, 0.5);
  }
`;

const BoxLabel = styled(Typography.Title)`
  margin-top: ${(p) => p.theme.spacing.sm};
  && {
    margin-bottom: 0;
  }
`;

const Row = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-left: calc(-${(p) => p.theme.spacing.sm} / 2);
  margin-right: calc(-${(p) => p.theme.spacing.sm} / 2);
`;

const Heading = styled(Typography.Title)`
  text-transform: uppercase;
`;

const UploadBox = styled(Upload.Dragger)`
  && {
    background-color: white;
  }
`;

const HomePage = memo(() => {
  const themes = useRecoilValue(edmThemeListSelector);
  const history = useHistory();
  const applyDesign = useSetRecoilState(replaceByDesignConfigSelector);

  const loadThemeConfig = useRecoilCallback<[string, EdmDesignConfig?], Promise<void>>(
    ({ set }) =>
      async (themeName, paramDesignConfig) => {
        set(isLoadingState, true);
        const themeConfig: EdmDesignConfig = await getThemeConfig(themeName);

        let designConfig: EdmDesignConfig = paramDesignConfig || {
          ...DefaultDesignConfig,
          id: uuidv4(),
          themeName,
        };

        set(currentEdmThemeNameState, themeName);
        set(currentDesignNameState, designConfig.name);

        set(availModuleListFamilyState(themeName), themeConfig?.modules || []);
        applyDesign(designConfig);

        set(isLoadingState, false);

        history.push('/edm-composer');
      },
    []
  );

  const handleSelect = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.currentTarget.querySelector('.ant-image')?.contains(e.target as any)) {
        e.stopPropagation();
        return;
      }

      const themeName = e.currentTarget.dataset.theme;
      themeName && loadThemeConfig(themeName);
    },
    [loadThemeConfig]
  );

  const handleUpload = useCallback(
    async (info: UploadChangeParam<UploadFile<File>>) => {
      const result = await loadFile(info.file as any, 'text');
      try {
        const designConfig: EdmDesignConfig = JSON.parse(result);

        if (!designConfig.themeName) {
          notify.error('Invalid Config file');
          return;
        }

        loadThemeConfig(designConfig.themeName, designConfig);
      } catch (e) {
        notify.error('Invalid Config file');
      }
    },
    [loadThemeConfig]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      const file = e.dataTransfer.files[0];

      if (!file) return;

      handleUpload({ file } as any);
    },
    [handleUpload]
  );

  return (
    <LayoutBasic isMinFullHeight actions={<Profile />}>
      <br />
      <Heading level={4}>Start With</Heading>
      <UploadBox
        multiple={false}
        name="design"
        onDrop={handleDrop}
        onChange={handleUpload}
        showUploadList={false}
        beforeUpload={preventUpload}
      >
        <p className="ant-upload-drag-icon" style={{ marginBottom: '0.5rem' }}>
          <CloudUploadOutlined />
        </p>
        <p className="ant-upload-text">Upload existing design</p>
      </UploadBox>

      <Divider />

      <Heading level={4}>Themes</Heading>
      <Row>
        {themes.map((theme) => (
          <Box key={theme.id} data-theme={theme.name} onClick={handleSelect}>
            <Image src={theme.thumbnail} alt={theme.name} />
            <BoxLabel level={5}>{theme.name}</BoxLabel>
          </Box>
        ))}
      </Row>
    </LayoutBasic>
  );
});

const HomePagePrefetch = memo(() => {
  // load data
  const prefetch = useRecoilCallback(
    ({ set }) =>
      async () => {
        set(isLoadingState, true);
        const edmThemes: EdmDesignConfig[] = await getAllThemes();

        set(edmThemeListState, edmThemes);

        set(isLoadingState, false);
      },
    []
  );

  useEffect(() => {
    prefetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <HomePage />;
});

export default HomePagePrefetch;
