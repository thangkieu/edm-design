import { atom } from 'recoil';

export const isReorderingState = atom<boolean>({
  key: 'isReorderingState',
  default: false,
});
