// routes/index.jsx
import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom';
import MainRoutes from './MainRoutes';
import LoginRoutes from './LoginRoutes';

// ProtectedRoute Component (for logged-in users only)
const ProtectedRoute = () => {
  const token = localStorage.getItem('token');
  return token ? <Outlet /> : <Navigate to="/login" replace />;
};

// PublicRoute Component (for guests only)
const PublicRoute = () => {
  const token = localStorage.getItem('token');
  return token ? <Navigate to="/dashboard/default" replace /> : <Outlet />;
};

// Router definition
const router = createBrowserRouter([
  {
    element: <ProtectedRoute />,
    children: [MainRoutes],
  },
  {
    element: <PublicRoute />,
    children: [LoginRoutes],
  },
], { basename: import.meta.env.VITE_APP_BASE_NAME });

export default router;
