import { lazy } from 'react';

// project import
import { UserRoute } from './RoleRoutes';
import Loadable from 'components/Loadable';
import MainLayout from 'layout/MainLayout';

// render - dashboard
const ReportDashboard = Loadable(lazy(() => import('pages/reportDashboard')));

// render - patient
// const PatientRegistration = Loadable(lazy(() => import('pages/patient/PatientRegistration')));
const PatientsList = Loadable(lazy(() => import('pages/patient/PatientsList')));

// render - assessment
const AssessmentForm = Loadable(lazy(() => import('pages/assessment')));

// render - report
const Report = Loadable(lazy(() => import('pages/report')));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/',
  element: <MainLayout />,
  children: [
    {
      path: '/',
      element: (
        <UserRoute>
          <ReportDashboard />
        </UserRoute>
      )
    },
    // {
    //   path: 'add-patient',
    //   element: (
    //     <UserRoute>
    //       <PatientRegistration />
    //     </UserRoute>
    //   )
    // },
    {
      path: 'patients',
      element: (
        <UserRoute>
          <PatientsList />
        </UserRoute>
      )
    },
    {
      path: 'risk-assessment',
      element: (
        <UserRoute>
          <AssessmentForm />
        </UserRoute>
      )
    },
    {
      path: 'report/:reportID',
      element: (
        <UserRoute>
          <Report />
        </UserRoute>
      )
    }
  ]
};

export default MainRoutes;
