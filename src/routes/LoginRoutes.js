import { lazy } from 'react';

// project import
import Loadable from 'components/Loadable';
import MinimalLayout from 'layout/MinimalLayout';

// render - login
const Login = Loadable(lazy(() => import('pages/authentication/Login')));

// render - Register
const Register = Loadable(lazy(() => import('pages/authentication/Register')));

// ==============================|| AUTH ROUTING ||============================== //

const LoginRoutes = {
  path: '/',
  element: <MinimalLayout />,
  children: [
    {
      path: 'login',
      element: <Login />
    },
    {
      path: 'register',
      element: <Register />
    }
  ]
};

export default LoginRoutes;
