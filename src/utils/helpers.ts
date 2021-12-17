import { ModuleTypeEnum } from '@app/enums';
import { WritableDraft } from 'immer/dist/types/types-external';
import { mergeWith } from 'lodash';

const patterns = {
  email:
    // eslint-disable-next-line no-control-regex
    /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/,
};

export type PatternType = keyof typeof patterns;
// to remove after refactoring LoginPage
export const validateBy = (type: PatternType, value: string) => {
  const pattern = patterns[type];

  if (!pattern) return true;

  return pattern.test(value);
};

export function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export const reorder = <T>(list: T[], startIndex: number, endIndex: number) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

export const separateModuleList = <T extends { type: ModuleType }>(list: T[]) => {
  return list.reduce<T[][]>(
    (acc, item) => {
      if (item.type === ModuleTypeEnum.Header) {
        acc[0].push(item);
      } else if (item.type === ModuleTypeEnum.Footer) {
        acc[2].push(item);
      } else {
        acc[1].push(item);
      }

      return acc;
    },
    [[], [], []]
  );
};

function customizer(objValue: any, srcValue: any): any {
  if (Array.isArray(srcValue)) {
    return srcValue;
  }

  if (srcValue && typeof srcValue === 'object') {
    return mergeWith(objValue, srcValue, customizer);
  }

  return typeof srcValue !== 'undefined' ? srcValue : objValue;
}

export function mergeDeep(...args: object[]) {
  // @ts-ignore
  return mergeWith.apply(null, [...args, customizer]);
}

export function preventUpload() {
  return false;
}

export async function loadFile(file: File, type: 'text' | 'image'): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    switch (type) {
      case 'text':
        reader.readAsText(file);
        break;
      case 'image':
        reader.readAsDataURL(file);
        break;
    }

    reader.onerror = (error) => reject(error);
    reader.onload = () => resolve(reader.result as string);
  });
}

export const convertHexToRGBA = (hexCode: string, opacity: number) => {
  let hex = hexCode.replace('#', '');

  if (hex.length === 3) {
    hex = `${hex[0]}${hex[0]}${hex[1]}${hex[1]}${hex[2]}${hex[2]}`;
  }

  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  return `rgba(${r},${g},${b},${opacity / 100})`;
};

export function updateId<T extends any>(draft: WritableDraft<T>) {
  Object.keys(draft).forEach((key) => {
    const item = (draft as any)[key];

    if (key === 'id') {
      (draft as any)['key'] = `key-${uuidv4()}`;
    } else if (Array.isArray(item as any)) {
      item.forEach((i: any) => updateId(i));
    } else if (item && typeof item === 'object') {
      updateId(item);
    }
  });

  return draft;
}

export function removeKeys<T extends object>(draft: WritableDraft<T>, keys: string[]) {
  Object.keys(draft).forEach((key) => {
    const item = (draft as any)[key];

    if (keys.includes(key)) {
      delete (draft as any)[key];
    } else if (Array.isArray(item as any)) {
      item.forEach((i: any) => void removeKeys(i, keys));
    } else if (item && typeof item === 'object') {
      removeKeys(item, keys);
    }
  });
}

export const formatDate = (date: Date | number, format: string) => {
  const d = typeof date === 'number' ? new Date(date) : date;
  const [dd, MM, yyyy, HH, mm, ss] = [
    d.getDate(),
    d.getMonth() + 1,
    d.getFullYear(),
    d.getHours(),
    d.getMinutes(),
    d.getSeconds(),
  ];

  return format
    .replace(/dd/g, dd < 10 ? `0${dd}` : `${dd}`)
    .replace(/MM/g, MM < 10 ? `0${MM}` : `${MM}`)
    .replace(/yyyy/g, `${yyyy}`)
    .replace(/HH/g, HH < 10 ? `0${HH}` : `${HH}`)
    .replace(/mm/g, mm < 10 ? `0${mm}` : `${mm}`)
    .replace(/ss/g, ss < 10 ? `0${ss}` : `${ss}`);
};
