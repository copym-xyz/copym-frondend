import React, { Suspense } from 'react';
import { useSelector } from 'react-redux';
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from 'react-router-dom';

// Lazy imports
const Dashboard = React.lazy(() => import('./pages/Dashboard.jsx'));
const AssetRegistration = React.lazy(() => import('./pages/assets/AssetRegistration'));
const AssetValidation = React.lazy(() => import('./pages/assets/AssetValidation'));
const DocumentManagement = React.lazy(() => import('./pages/documents/DocumentManagement'));
const Login = React.lazy(() => import('./pages/auth/Login').then(module => ({
  default: module.default || module
})));
const Register = React.lazy(() => import('./pages/auth/Register'));

const RegistrationPending = React.lazy(() => import('./features/auth/RegisterPending.jsx'));
const AdminDashboard = React.lazy(() => import('./pages/admin/AdminDashboard.jsx'));
// const InstitutionDashboard = React.lazy(() => import('./pages/institution/InstitutionDashboard.jsx'));
const UserDashboard = React.lazy(() => import('./pages/user/UserDashboard.jsx'));

// Import components
import LoadingSpinner from './components/ui/LoadingSpinner.jsx';
import Layout from './components/layout/Layout.jsx';
import LandingPage from './Landing/LandingPage.jsx';
import PrivateRoute from './components/PrivateRoute.jsx';
import { RegisterInstitution } from './pages/auth/RegisterInstitution.jsx';
import { Toaster } from 'sonner';
import InstitutionDashboard from './pages/institution/InstitutionDashboard.jsx';
import NotFound from './Notfound/Notfound.jsx';
import Unauthorized from './components/Unauthorized.jsx';
import InstitutionsList from './pages/institution/InstitutionsList.jsx';
import UsersList from './pages/user/UsersList.jsx';

const App = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingSpinner />}>
        <Toaster position="top-right" richColors />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/register-institution" element={<RegisterInstitution />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* Protected Routes with Layout */}
          <Route path="/dashboard" element={
            <PrivateRoute allowedRoles={['super_admin']}>
              <Layout>
                <AdminDashboard />
              </Layout>
            </PrivateRoute>
          } />

          {/* Super Admin Routes */}
          <Route
            path="/institutions"
            element={
              <PrivateRoute allowedRoles={['super_admin']}>
                <Layout>
                  <InstitutionsList />
                </Layout>
              </PrivateRoute>
            }
          />

          <Route path="/users" element={
            <PrivateRoute allowedRoles={['super_admin']}>
              <Layout>
                <UsersList />
              </Layout>
            </PrivateRoute>
          } />

          <Route path="/assets/validate" element={
            <PrivateRoute allowedRoles={['super_admin']}>
              <Layout>
                <AssetValidation />
              </Layout>
            </PrivateRoute>
          } />

          {/* Catch-all route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};


export default App;