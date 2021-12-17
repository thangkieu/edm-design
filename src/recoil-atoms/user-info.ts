import { atom } from 'recoil';

export const userInfoState = atom<UserInfo | null>({
  key: 'userInfoState',
  default: null,
});
