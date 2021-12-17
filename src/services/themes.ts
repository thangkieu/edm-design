import DomToImage from 'dom-to-image';
import { SetterOrUpdater } from 'recoil';

import { apiHelpers } from './api';

export async function getAllThemes() {
  const edmThemes: EdmDesignConfig[] = await apiHelpers.clientGet('/themes/edm-themes.json');

  return edmThemes;
}

export async function getThemeConfig(themeName: string): Promise<EdmDesignConfig> {
  const themeConfig: EdmDesignConfig = await apiHelpers.clientGet(`/themes/${themeName}/data.json`);

  return themeConfig;
}

export async function saveCurentDesign(
  saveFn: SetterOrUpdater<{ htmlFileKey?: string; screenshot?: string } | null | undefined>,
  params?: { htmlFileKey?: string }
) {
  let screenshot = '';

  try {
    screenshot = await DomToImage.toPng(document.getElementById('edm-design-renderer') as any);
  } catch (err) {
    console.debug(err);
  }

  saveFn({ screenshot, ...(params ? params : {}) });
}
