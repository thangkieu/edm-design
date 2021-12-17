import { BgColorsOutlined } from '@icons';
import { availModuleListFamilyState, currentEdmThemeNameState } from '@recoil-atoms/atoms';
import {
  applyThemeSelector,
  edmThemeListSelector,
  saveDesignSelector,
} from '@recoil-atoms/selectors';
import { getThemeConfig, saveCurentDesign } from '@services/themes';
import { Button, Modal, Tabs } from '@uikits';
import { memo, useCallback, useEffect, useState } from 'react';
import { useRecoilCallback, useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';

interface Props {
  data?: Partial<SendEmailForm>;
  onSubmit?(data: SendEmailForm): void;
}

export const ThemeSelection = memo<Props>((props) => {
  const themes = useRecoilValue(edmThemeListSelector);
  const [currentTheme, updateThemeName] = useRecoilState(currentEdmThemeNameState);
  const saveDesign = useSetRecoilState(saveDesignSelector);
  const applyTheme = useSetRecoilState(applyThemeSelector);

  const [isVisible, toggleVisible] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState(currentTheme);
  const [loadingTheme, toggleLoadingTheme] = useState(false);

  // load data
  const fetchThemeData = useRecoilCallback(
    ({ snapshot }) =>
      async (newThemeName: string) => {
        if (!newThemeName) return;

        const baseModules = snapshot
          .getLoadable(availModuleListFamilyState(newThemeName))
          .valueMaybe();

        if (baseModules && baseModules.length > 0) {
          applyTheme({ name: newThemeName, modules: baseModules });

          return;
        }

        const newThemeConfig: EdmDesignConfig = await getThemeConfig(newThemeName);

        applyTheme(newThemeConfig);
      },
    []
  );

  const handleApply = useCallback(async () => {
    toggleLoadingTheme(true);

    await saveCurentDesign(saveDesign);

    updateThemeName(selectedTheme);

    await fetchThemeData(selectedTheme);

    toggleLoadingTheme(false);
    toggleVisible(false);
  }, [fetchThemeData, saveDesign, selectedTheme, updateThemeName]);

  const handleToggle = useCallback(() => {
    toggleVisible(!isVisible);
  }, [isVisible]);

  const handleThemeChanged = useCallback((activeKey: string) => {
    setSelectedTheme(activeKey);
  }, []);

  useEffect(() => {
    currentTheme && setSelectedTheme(currentTheme);
  }, [currentTheme]);

  return (
    <>
      <Button icon={<BgColorsOutlined />} block onClick={handleToggle}>
        Apply Theme
      </Button>
      <Modal
        title="Theme Selection"
        visible={isVisible}
        okText="Apply"
        okButtonProps={{
          type: 'primary',
          disabled: currentTheme === selectedTheme,
          loading: loadingTheme,
        }}
        onOk={handleApply}
        onCancel={handleToggle}
        bodyStyle={{ paddingBottom: 0, paddingTop: 0 }}
      >
        <Tabs
          className="tabs-left-in-modal"
          tabPosition="left"
          onChange={handleThemeChanged}
          activeKey={selectedTheme}
        >
          {themes.map((i) => (
            <Tabs.TabPane key={i.name} tab={i.name}>
              <img src={i.thumbnail} alt={i.name} />
            </Tabs.TabPane>
          ))}
        </Tabs>
      </Modal>
    </>
  );
});
