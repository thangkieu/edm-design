import { apiHelpers } from './api';
import { removeToken, saveToken } from './api/base-api';

export const getOTP = async (email: string) => {
  try {
    const resp: FetchOTPResp = await apiHelpers.authPost('/email_otp', {
      body: JSON.stringify({ email }),
    });

    return resp;
  } catch (err) {
    console.debug(err);
  }

  return null;
};

export const login = async (email: string, otp: number) => {
  try {
    const resp: FetchTokenRespSuccess = await apiHelpers.authPost('/get_jwt_token', {
      body: JSON.stringify({ email, otp }),
    });

    if (!resp) throw Error('Error');

    saveToken(resp.jwt);

    return resp;
  } catch (err) {
    console.debug(err);
    removeToken();
  }

  return null;
};

export const logout = () => {
  removeToken();
};
