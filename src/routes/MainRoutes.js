import { lazy } from 'react';

// project import
import Loadable from 'components/Loadable';
import MainLayout from 'layout/MainLayout';

// render - dashboard
const DashboardDefault = Loadable(lazy(() => import('pages/dashboard')));
const ReportDashboard = Loadable(lazy(() => import('pages/reportDashboard')));

// render - patient
const NewPatient = Loadable(lazy(() => import('pages/patient/PatientRegistrationForm')));
const PatientsList = Loadable(lazy(() => import('pages/patient/PatientsList')));

// render - assessment
const AssessmentForm = Loadable(lazy(() => import('pages/assessment')));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/',
  element: <MainLayout />,
  children: [
    {
      path: '/',
      element: <DashboardDefault />
    },
    {
      path: 'dashboard',
      children: [
        {
          path: 'default',
          element: <DashboardDefault />
        },
        {
          path: 'reports',
          element: <ReportDashboard />
        }
      ]
    },
    {
      path: 'add-patient',
      element: <NewPatient />
    },
    {
      path: 'patients',
      element: <PatientsList />
    },
    {
      path: 'risk-assessment',
      element: <AssessmentForm />
    }
  ]
};

export default MainRoutes;
