import { lazy } from 'react';

// project import
import { AdminRoute } from './RoleRoutes';
import Loadable from 'components/Loadable';
import MinimalLayout from 'layout/MinimalLayout';

// render - Register
const Register = Loadable(lazy(() => import('pages/authentication/Register')));

// ==============================|| ADMIN ROUTING ||============================== //

const AdminRoutes = {
  path: '/',
  element: <MinimalLayout />,
  children: [
    {
      path: 'register',
      element: (
        <AdminRoute>
          <Register />
        </AdminRoute>
      )
    }
  ]
};

export default AdminRoutes;
