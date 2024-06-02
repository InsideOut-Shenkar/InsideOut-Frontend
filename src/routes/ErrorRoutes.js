import { lazy } from 'react';

// project import
import Loadable from 'components/Loadable';
import MainLayout from 'layout/MainLayout';

// render - Error
const ErrorPage = Loadable(lazy(() => import('pages/ErrorPage')));

// ==============================|| ERROR ROUTING ||============================== //

const ErrorRoutes = {
  path: '/',
  element: <MainLayout />,
  children: [
    {
      path: '*',
      element: <ErrorPage />
    }
  ]
};

export default ErrorRoutes;
