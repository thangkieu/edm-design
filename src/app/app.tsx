import { OverlayLoading } from '@components/OverlayLoading';
import loadable from '@loadable/component';
import { isLoadingState } from '@recoil-atoms/atoms';
import { ErrorBoundary } from '@uikits';
import { ConfigProvider } from 'antd';
import { memo, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { RecoilRoot, useRecoilSnapshot, useRecoilValue } from 'recoil';
import { ThemeProvider } from 'styled-components';
import { AuthRoute } from '../components/AuthRoute';
import { GlobalStyle } from '../components/GlobalStyles';
import './antd-theme';
import { configProviders } from './antd-theme';
import { routes } from './routes';
import { theme } from './theme';

const NotFoundPage = loadable(() => import('../pages/NotFound'));

const DebugObserver = memo(() => {
  const snapshot = useRecoilSnapshot();
  useEffect(() => {
    // eslint-disable-next-line
    for (const node of snapshot.getNodes_UNSTABLE({ isModified: true })) {
      console.debug(node.key, snapshot.getLoadable(node).getValue());
    }
  }, [snapshot]);

  return null;
});

const AppContent = memo(() => {
  const isLoading = useRecoilValue(isLoadingState);

  return (
    <>
      {isLoading && <OverlayLoading />}
      <ErrorBoundary>
        <ThemeProvider theme={theme}>
          <GlobalStyle />
          <ConfigProvider {...configProviders}>
            <Router basename={process.env.PUBLIC_URL}>
              <Switch>
                {routes.map((route) =>
                  route.auth ? (
                    <AuthRoute
                      key={route.path}
                      path={route.path}
                      exact={route.exact}
                      component={route.component}
                    />
                  ) : (
                    <Route
                      key={route.path}
                      path={route.path}
                      exact={route.exact}
                      component={route.component}
                    />
                  )
                )}
                <Route component={NotFoundPage} />
              </Switch>
            </Router>
          </ConfigProvider>
        </ThemeProvider>
      </ErrorBoundary>
    </>
  );
});

export const App = memo(() => {
  return (
    <RecoilRoot>
      <DebugObserver />
      <AppContent />
    </RecoilRoot>
  );
});

export default App;
