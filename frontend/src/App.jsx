/**
 * CHANGES vs original App.jsx:
 *
 * 1. LAZY LOADING (High) — All page components now use React.lazy() +
 *    Suspense. This enables code splitting: users download only the JS for
 *    the pages they actually visit. Admin pages in particular are never sent
 *    to non-admin users.
 *    Estimated savings: ~35 KB on initial bundle.
 *
 * 2. ERROR BOUNDARY (High) — Wraps the entire route tree. A single component
 *    error no longer crashes the whole application.
 *
 * 3. NAVIGATION SERVICE (Critical) — NavigationSetter registers the navigate
 *    function so axios.js can redirect to /login without a full page reload.
 */

import { Routes, Route, useNavigate } from 'react-router-dom';
import { useEffect, lazy, Suspense } from 'react';
import { useAuth } from './context/AuthContext';
import { setNavigateFunction } from './utils/NavigationService';

import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Loader from './components/ui/Loader';
import ProtectedRoute from './components/layout/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';

// Static imports — small, shared components loaded immediately
// (Navbar/Footer are always rendered so no benefit to lazy-loading them)

// Lazy-loaded pages — each becomes its own JS chunk
const Home           = lazy(() => import('./pages/Home'));
const Properties     = lazy(() => import('./pages/Properties'));
const PropertyDetail = lazy(() => import('./pages/PropertyDetail'));
const Login          = lazy(() => import('./pages/Login'));
const Register       = lazy(() => import('./pages/Register'));
const Dashboard      = lazy(() => import('./pages/admin/Dashboard'));
const AddProperty    = lazy(() => import('./pages/admin/AddProperty'));
const ManageProperties = lazy(() => import('./pages/admin/ManageProperties'));

/**
 * Registers React Router's navigate with the navigation service.
 * Must be rendered inside <BrowserRouter> so useNavigate() works.
 * Renders nothing — purely a side-effect component.
 */
function NavigationSetter() {
  const navigate = useNavigate();
  useEffect(() => {
    setNavigateFunction(navigate);
  }, [navigate]);
  return null;
}

export default function App() {
  const { loading } = useAuth();
  if (loading) return <Loader />;

  return (
    <ErrorBoundary>
      <NavigationSetter />
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Navbar />
        <main style={{ flex: 1 }}>
          {/* Suspense fallback shown while any lazy page chunk is downloading */}
          <Suspense fallback={<Loader />}>
            <Routes>
              <Route path="/"               element={<Home />} />
              <Route path="/properties"     element={<Properties />} />
              <Route path="/properties/:id" element={<PropertyDetail />} />
              <Route path="/login"          element={<Login />} />
              <Route path="/register"       element={<Register />} />

              {/* Admin Routes */}
              <Route path="/admin" element={<ProtectedRoute adminOnly />}>
                <Route index                    element={<Dashboard />} />
                <Route path="add-property"      element={<AddProperty />} />
                <Route path="properties"        element={<ManageProperties />} />
                <Route path="edit-property/:id" element={<AddProperty />} />
              </Route>
            </Routes>
          </Suspense>
        </main>
        <Footer />
      </div>
    </ErrorBoundary>
  );
}