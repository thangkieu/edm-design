import { PictureOutlined } from '@components/Icons';
import { TagInputs } from '@components/TagInput';
import { currentEdmThemeNameState, designHistoryState, htmlKeyState } from '@recoil-atoms/atoms';
import {
  replaceByDesignConfigSelector,
  savedDesignHistorySelector,
  saveDesignSelector,
} from '@recoil-atoms/selectors';
import { saveCurentDesign } from '@services/themes';
import { Button, Image, Modal, Space, Tabs, Typography } from '@uikits';
import { formatDate } from '@utils/helpers';
import { memo, useCallback, useMemo, useState } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import styled from 'styled-components';

interface HistoryItemProps {
  label: string;
  name: string;
  time: string;
  themeName: string;
}

const TabHeadingStyle = styled.div`
  text-align: left;
`;

const TabName = styled(Typography.Title)`
  && {
    margin-bottom: 0;
  }
`;

const TabHeading = memo<HistoryItemProps>(({ label, time, themeName }) => {
  const updateHistoryLabel = useSetRecoilState(savedDesignHistorySelector);

  const [localLabel, setLocalLabel] = useState(label);

  const timeFormatted = useMemo(
    () => formatDate(parseInt(time, 10), 'dd/MM/yyyy HH:mm:ss'),
    [time]
  );

  const handleEditLabel = useCallback(
    (values: string[]) => {
      setLocalLabel(values[0]);

      updateHistoryLabel({ time, label: values[0] });
    },
    [time, updateHistoryLabel]
  );

  return (
    <TabHeadingStyle>
      <TabName level={5}>{timeFormatted}</TabName>
      <Space direction="vertical" size="small">
        <Typography.Text>{`Theme: ${themeName}`}</Typography.Text>
        <TagInputs
          maxCount={1}
          values={localLabel ? [localLabel] : []}
          onChange={handleEditLabel}
        />
      </Space>
    </TabHeadingStyle>
  );
});

const EmptyTab = styled(Tabs.TabPane)`
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  min-height: 200px;
`;

interface Props {
  className?: string;
}

const TabOverride = styled(Tabs)`
  .ant-tabs-nav {
    flex: 0 0 40%;
  }

  .ant-typography-edit .anticon {
    margin-right: 0;
  }

  .ant-typography-edit-content {
    margin-bottom: 0;
    margin-top: ${(p) => p.theme.spacing.xs};
    margin-left: 0;
  }

  .ant-tabs-tab .anticon {
    margin-right: 0;
  }

  .ant-tabs-content {
    height: 100%;
  }
`;

export const HistoryList = memo<Props>(({ className }) => {
  const [isSaving, toggleSaving] = useState(false);
  const [isVisible, toggle] = useState(false);
  const savedHistory = useRecoilValue(designHistoryState);
  const saveDesign = useSetRecoilState(saveDesignSelector);
  const replaceDesign = useSetRecoilState(replaceByDesignConfigSelector);
  const updateThemeName = useSetRecoilState(currentEdmThemeNameState);
  const setHtmlKey = useSetRecoilState(htmlKeyState);

  const [selectedTime, setSelectedTime] = useState('');

  const histories = useMemo(() => Object.keys(savedHistory), [savedHistory]);

  const handleToggle = useCallback(() => {
    if (isVisible) {
      // closing
      setSelectedTime('');
    }

    toggle(!isVisible);
  }, [isVisible]);

  const handleConfirm = useCallback(async () => {
    const { designConfig, htmlFileKey } = savedHistory[selectedTime];

    toggleSaving(true);

    await saveCurentDesign(saveDesign);

    toggleSaving(false);

    updateThemeName(designConfig.themeName);
    setHtmlKey(htmlFileKey);
    replaceDesign(designConfig);

    handleToggle();
  }, [
    handleToggle,
    savedHistory,
    selectedTime,
    saveDesign,
    updateThemeName,
    replaceDesign,
    setHtmlKey,
  ]);

  const handleSelect = useCallback((time: string) => {
    setSelectedTime(time);
  }, []);

  return (
    <>
      <Button disabled={histories?.length <= 1} className={className} block onClick={handleToggle}>
        Saved History
      </Button>
      <Modal
        title="Select Version"
        visible={isVisible}
        onOk={handleConfirm}
        onCancel={handleToggle}
        okButtonProps={{ disabled: !Boolean(selectedTime), loading: isSaving }}
        width={600}
        bodyStyle={{ paddingTop: 0, paddingBottom: 0, paddingRight: 0, paddingLeft: 16 }}
      >
        <TabOverride
          className={`tabs-left-in-modal ${!selectedTime ? 'tabs-empty' : ''}`}
          tabPosition="left"
          onChange={handleSelect}
          activeKey={selectedTime}
          style={{ maxHeight: '50vh' }}
        >
          {!selectedTime && (
            <EmptyTab key="" tab="">
              <PictureOutlined style={{ fontSize: 40, marginBottom: 16 }} />
              <Typography.Paragraph>
                Select a version on the left side to preview
              </Typography.Paragraph>
            </EmptyTab>
          )}

          {histories.map((time) => (
            <Tabs.TabPane
              key={time}
              tab={
                <TabHeading
                  name={savedHistory[time].designConfig.name}
                  label={savedHistory[time].label}
                  time={time}
                  themeName={savedHistory[time].designConfig.themeName}
                />
              }
            >
              <Image src={savedHistory[time].thumb} alt={savedHistory[time].designConfig.name} />
            </Tabs.TabPane>
          ))}
        </TabOverride>
      </Modal>
    </>
  );
});
