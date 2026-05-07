import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Toaster } from 'react-hot-toast';

// Layouts
import PublicLayout from './layouts/PublicLayout';
import DashboardLayout from './layouts/DashboardLayout';

// Public Portal Pages
import HomePage from './pages/public/HomePage';
import SearchPage from './pages/public/SearchPage';
import VerifyPage from './pages/public/VerifyPage';

// Registration Portal Pages
import RegisterPage from './pages/registration/RegisterPage';
import NameReservationPage from './pages/registration/NameReservationPage';
import BusinessInfoPage from './pages/registration/BusinessInfoPage';
import SubmissionCompletePage from './pages/registration/SubmissionCompletePage';

// Owner Portal Pages
import OwnerDashboard from './pages/owner/Dashboard';
import ApplicationStatusPage from './pages/owner/ApplicationStatusPage';
import PaymentPage from './pages/owner/PaymentPage';
import CertificatesPage from './pages/owner/CertificatesPage';

// LBR Portal Pages
import LBRDashboard from './pages/lbr/Dashboard';
import ApplicationsListPage from './pages/lbr/ApplicationsListPage';
import ApplicationReviewPage from './pages/lbr/ApplicationReviewPage';

// LRA Portal Pages
import LRADashboard from './pages/lra/Dashboard';
import TaxAssessmentPage from './pages/lra/TaxAssessmentPage';

// Admin Portal Pages
import AdminDashboard from './pages/admin/Dashboard';
import UsersManagementPage from './pages/admin/UsersManagementPage';
import AuditLogsPage from './pages/admin/AuditLogsPage';

// Auth Pages
import LoginPage from './pages/auth/LoginPage';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1a73e8',
    },
    secondary: {
      main: '#dc3545',
    },
  },
});

const queryClient = new QueryClient();

function App() {
  const isAuthenticated = localStorage.getItem('token');
  const userRole = localStorage.getItem('userRole');

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <Router>
          <Toaster position="top-right" />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<PublicLayout />}>
              <Route index element={<HomePage />} />
              <Route path="search" element={<SearchPage />} />
              <Route path="verify" element={<VerifyPage />} />
              <Route path="register" element={<RegisterPage />} />
            </Route>

            {/* Auth Routes */}
            <Route path="/login" element={<LoginPage />} />

            {/* Registration Portal */}
            <Route path="/registration" element={<DashboardLayout />}>
              <Route path="name-reservation" element={<NameReservationPage />} />
              <Route path="business-info" element={<BusinessInfoPage />} />
              <Route path="complete" element={<SubmissionCompletePage />} />
            </Route>

            {/* Owner Portal */}
            <Route path="/owner" element={<DashboardLayout />}>
              <Route index element={<OwnerDashboard />} />
              <Route path="applications" element={<ApplicationStatusPage />} />
              <Route path="payment/:businessId" element={<PaymentPage />} />
              <Route path="certificates" element={<CertificatesPage />} />
            </Route>

            {/* LBR Portal */}
            <Route path="/lbr" element={<DashboardLayout />}>
              <Route index element={<LBRDashboard />} />
              <Route path="applications" element={<ApplicationsListPage />} />
              <Route path="review/:applicationId" element={<ApplicationReviewPage />} />
            </Route>

            {/* LRA Portal */}
            <Route path="/lra" element={<DashboardLayout />}>
              <Route index element={<LRADashboard />} />
              <Route path="assess/:businessId" element={<TaxAssessmentPage />} />
            </Route>

            {/* Admin Portal */}
            <Route path="/admin" element={<DashboardLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="users" element={<UsersManagementPage />} />
              <Route path="audit-logs" element={<AuditLogsPage />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Router>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
