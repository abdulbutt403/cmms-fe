import { lazy } from 'react';

// project imports
import Loadable from 'components/Loadable';
import DashboardLayout from 'layout/Dashboard';
import AddVendor from '../pages/dashboard/Vendors';
import AddBuilding from '../pages/dashboard/Building';
import AddAsset from '../pages/dashboard/Assets';
import AddTeamForm from '../pages/dashboard/Team';
import AddUserForm from '../pages/dashboard/Users';
import Customers from '../pages/dashboard/Customer';
import Parts from '../pages/dashboard/Parts';
import ViewAssets from '../sections/dashboard/VIews/ViewAssets'; // Import the new ViewAssets page
import ViewParts from '../sections/dashboard/VIews/ViewParts';

// render- Dashboard
const DashboardDefault = Loadable(lazy(() => import('pages/dashboard/default')));
const WorkOrderPage = Loadable(lazy(() => import('pages/dashboard/WorkOrder'))); // Import the new WorkOrder page

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/',
  element: <DashboardLayout />,
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
          path: 'work-order', // Add the new child route
          element: <WorkOrderPage /> // Render the WorkOrder page
        },
            {
          path: 'vendor-management', // Add the new child route
          element: <AddVendor /> // Render the WorkOrder page
        },
        {
          path: 'buildings', // Add the new child route
          element: <AddBuilding /> // Render the WorkOrder page
        },
        {
          path: 'assets',
          element: <AddAsset />
        },
        {
          path: 'asset/:id', // New route for viewing an asset
          element: <ViewAssets />
        },
        {
          path: 'parts',
          element: <Parts />
        },
        {
        path: "part/:id",
        element: <ViewParts />,
      },
        {
          path: 'teams',
          element: <AddTeamForm />
        },
        {
          path: 'users',
          element: <AddUserForm />
        },
        {
          path: 'customer-management',
          element: <Customers />
        },

      ]
    },
  ]
};

export default MainRoutes;
