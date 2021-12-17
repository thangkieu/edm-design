import { isLoadingState } from '@recoil-atoms/atoms';
import { logoutSelector } from '@recoil-atoms/selectors';
import { memo, useEffect } from 'react';
import { Route, useHistory } from 'react-router';
import { RouteProps } from 'react-router-dom';
import { useRecoilState, useResetRecoilState, useSetRecoilState } from 'recoil';
import { userInfoState } from '../recoil-atoms/user-info';
import { getUserInfo } from '../services/profile';

export const AuthRoute = memo<RouteProps>((props) => {
  const history = useHistory();
  const toggleLoading = useSetRecoilState(isLoadingState);
  const logout = useResetRecoilState(logoutSelector);
  const [userInfo, setUserInfo] = useRecoilState(userInfoState);

  useEffect(() => {
    const abort = new AbortController();
    async function getInfo() {
      toggleLoading(true);
      const resp: FetchDecodeJwtResp = await getUserInfo(abort.signal);

      toggleLoading(false);
      if (!resp) {
        logout();
        history.push('/login');

        return;
      }

      // store user info
      setUserInfo(resp.sub);
    }

    if (!userInfo) getInfo();

    return () => {
      // abort.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <Route {...props} />;
});
