import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import { AnimatePresence } from 'framer-motion';

// Layout Components
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';
import AdminLayout from './layouts/AdminLayout';

// Route Guards
import PrivateRoute from './components/guards/PrivateRoute';
import PublicRoute from './components/guards/PublicRoute';
import AdminRoute from './components/guards/AdminRoute';

// Lazy load pages for better performance
const HomePage = lazy(() => import('./pages/HomePage'));
const EventsPage = lazy(() => import('./pages/EventsPage'));
const EventDetailsPage = lazy(() => import('./pages/EventDetailsPage'));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'));
const PaymentPage = lazy(() => import('./pages/PaymentPage'));
const TicketsPage = lazy(() => import('./pages/TicketsPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const LoginPage = lazy(() => import('./pages/auth/LoginPage'));
const RegisterPage = lazy(() => import('./pages/auth/RegisterPage'));
const ForgotPasswordPage = lazy(() => import('./pages/auth/ForgotPasswordPage'));
const ValidateTicketPage = lazy(() => import('./pages/ValidateTicketPage'));

// Admin Pages
const AdminDashboard = lazy(() => import('./pages/admin/DashboardPage'));
const AdminEvents = lazy(() => import('./pages/admin/EventsPage'));
const AdminOrders = lazy(() => import('./pages/admin/OrdersPage'));
const AdminUsers = lazy(() => import('./pages/admin/UsersPage'));
const AdminReports = lazy(() => import('./pages/admin/ReportsPage'));

// Error Pages
const NotFoundPage = lazy(() => import('./pages/errors/NotFoundPage'));
const ErrorPage = lazy(() => import('./pages/errors/ErrorPage'));

// Loading Component
const PageLoader = () => (
  <Box
    sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    }}
  >
    <CircularProgress size={60} sx={{ color: 'white' }} />
  </Box>
);

const App: React.FC = () => {
  return (
    <AnimatePresence mode="wait">
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Public Routes */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/eventos" element={<EventsPage />} />
            <Route path="/evento/:slug" element={<EventDetailsPage />} />
            <Route path="/validar" element={<ValidateTicketPage />} />
          </Route>

          {/* Auth Routes */}
          <Route element={<PublicRoute />}>
            <Route element={<AuthLayout />}>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/registar" element={<RegisterPage />} />
              <Route path="/recuperar-password" element={<ForgotPasswordPage />} />
            </Route>
          </Route>

          {/* Private Routes */}
          <Route element={<PrivateRoute />}>
            <Route element={<MainLayout />}>
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/pagamento/:orderId" element={<PaymentPage />} />
              <Route path="/bilhetes" element={<TicketsPage />} />
              <Route path="/perfil" element={<ProfilePage />} />
            </Route>
          </Route>

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminRoute />}>
            <Route element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="eventos" element={<AdminEvents />} />
              <Route path="pedidos" element={<AdminOrders />} />
              <Route path="utilizadores" element={<AdminUsers />} />
              <Route path="relatorios" element={<AdminReports />} />
            </Route>
          </Route>

          {/* Error Routes */}
          <Route path="/erro" element={<ErrorPage />} />
          <Route path="/404" element={<NotFoundPage />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
      </Suspense>
    </AnimatePresence>
  );
};

export default App;