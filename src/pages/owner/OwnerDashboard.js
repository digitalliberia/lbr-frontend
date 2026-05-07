import Dashboard from './Dashboard';
export default Dashboard;
EOF

# Now let's check and fix the App.js imports
cat > src/App.js << 'EOF'
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';
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
import Dashboard from './pages/owner/Dashboard';
import ApplicationStatusPage from './pages/owner/ApplicationStatusPage';
import PaymentPage from './pages/owner/PaymentPage';
import CertificatesPage from './pages/owner/CertificatesPage';

// LBR Portal Pages
import LBRDashboard from './pages/lbr/LBRDashboard';
import ApplicationsListPage from './pages/lbr/ApplicationsListPage';
import ApplicationReviewPage from './pages/lbr/ApplicationReviewPage';

// LRA Portal Pages
import LRADashboard from './pages/lra/LRADashboard';
import TaxAssessmentPage from './pages/lra/TaxAssessmentPage';

// Admin Portal Pages
import AdminDashboard from './pages/admin/AdminDashboard';
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

function App() {
  const isAuthenticated = localStorage.getItem('token');
  const userRole = localStorage.getItem('userRole');

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Toaster position="top-right" />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<PublicLayout />}>
            <Route index element={<HomePage />} />
            <Route path="search" element={<SearchPage />} />
            <Route path="verify" element={<VerifyPage />} />
          </Route>

          {/* Auth Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected Routes - require authentication */}
          <Route path="/registration" element={isAuthenticated ? <DashboardLayout /> : <Navigate to="/login" />}>
            <Route path="name-reservation" element={<NameReservationPage />} />
            <Route path="business-info" element={<BusinessInfoPage />} />
            <Route path="complete" element={<SubmissionCompletePage />} />
          </Route>

          {/* Owner Portal */}
          <Route path="/owner" element={isAuthenticated && userRole === 'owner' ? <DashboardLayout /> : <Navigate to="/login" />}>
            <Route index element={<Dashboard />} />
            <Route path="applications" element={<ApplicationStatusPage />} />
            <Route path="payment/:businessId" element={<PaymentPage />} />
            <Route path="certificates" element={<CertificatesPage />} />
          </Route>

          {/* LBR Portal */}
          <Route path="/lbr" element={isAuthenticated && (userRole === 'lbr_officer' || userRole === 'admin') ? <DashboardLayout /> : <Navigate to="/login" />}>
            <Route index element={<LBRDashboard />} />
            <Route path="applications" element={<ApplicationsListPage />} />
            <Route path="review/:applicationId" element={<ApplicationReviewPage />} />
          </Route>

          {/* LRA Portal */}
          <Route path="/lra" element={isAuthenticated && (userRole === 'lra_officer' || userRole === 'admin') ? <DashboardLayout /> : <Navigate to="/login" />}>
            <Route index element={<LRADashboard />} />
            <Route path="assess/:businessId" element={<TaxAssessmentPage />} />
          </Route>

          {/* Admin Portal */}
          <Route path="/admin" element={isAuthenticated && userRole === 'admin' ? <DashboardLayout /> : <Navigate to="/login" />}>
            <Route index element={<AdminDashboard />} />
            <Route path="users" element={<UsersManagementPage />} />
            <Route path="audit-logs" element={<AuditLogsPage />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
