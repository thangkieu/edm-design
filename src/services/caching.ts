import localforage from 'localforage';

const EXPIRE_TIME = 1000 * 60 * 60 * 24 * 7; // 1 week

export const caching = {
  get: async (name: string) => {
    return null;

    const { value, expireTime } = (await localforage.getItem(name)) || {};

    if (!expireTime) return value;

    if (expireTime > Date.now()) return value;

    await localforage.removeItem(name);

    return null;
  },
  set: async (name: string, value: any, noExpire?: boolean) => {
    try {
      await localforage.setItem(name, {
        value,
        ...(noExpire ? {} : { expireTime: Date.now() + EXPIRE_TIME }),
      });

      return true;
    } catch (e) {
      return false;
    }
  },
};
