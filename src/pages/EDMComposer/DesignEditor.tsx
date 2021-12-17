import { theme } from '@app/theme';
import { ThemeSelection } from '@components/ThemeSelection';
import { designConfigModifiedSelector, saveDesignSelector } from '@recoil-atoms/selectors';
import { saveCurentDesign } from '@services/themes';
import { Button, Card, Space, Typography } from '@uikits';
import { memo, useCallback, useState } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import styled from 'styled-components';
import { HistoryList } from './HistoryList';
import { ModuleConfigList } from './ModuleConfigList';
const Wrapper = styled.div`
  height: 100%;
  overflow-y: auto;
`;

export const DesignEditor = memo(() => {
  const [isSaving, toggleSaving] = useState(false);

  const saveDesign = useSetRecoilState(saveDesignSelector);
  const isModified = useRecoilValue(designConfigModifiedSelector);

  const handleClick = useCallback(async () => {
    toggleSaving(true);

    await saveCurentDesign(saveDesign);

    toggleSaving(false);
  }, [saveDesign]);

  return (
    <Wrapper>
      <Card bordered={false} bodyStyle={{ paddingBottom: theme.spacing.sm }}>
        <Typography.Title
          level={4}
          style={{
            marginBottom: 0,
          }}
        >
          Add/edit the modules below
        </Typography.Title>
        <Typography.Text type="secondary">
          <small>Select the modules below to edit the content</small>
        </Typography.Text>
      </Card>

      <ModuleConfigList />

      <Card bordered={false}>
        <Space direction="vertical" style={{ width: '100%' }}>
          <ThemeSelection />

          <HistoryList />

          <Button
            block
            type="primary"
            onClick={handleClick}
            disabled={!isModified || isSaving}
            loading={isSaving}
          >
            Save Design
          </Button>
        </Space>
      </Card>
    </Wrapper>
  );
});

export default DesignEditor;
