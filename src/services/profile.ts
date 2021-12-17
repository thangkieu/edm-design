import { apiHelpers } from './api';

export const getUserInfo = async (signalToAbort?: AbortSignal) => {
  try {
    const resp = await apiHelpers.authGet('/decode_jwt', { signal: signalToAbort });

    return resp;
  } catch (error) {
    console.debug(error);
    return null;
  }
};
