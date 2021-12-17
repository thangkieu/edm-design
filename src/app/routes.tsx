import loadable from '@loadable/component';

export const routes: RouteConfig[] = [
  {
    path: '/login',
    exact: true,
    component: loadable(() => import('../pages/LoginPage')),
  },
  {
    path: '/',
    exact: true,
    // auth: true,
    component: loadable(() => import('../pages/EDMComposer')),
  },
  {
    path: '/edm-composer',
    exact: true,
    // auth: true,
    component: loadable(() => import('../pages/EDMComposer')),
  },
];
