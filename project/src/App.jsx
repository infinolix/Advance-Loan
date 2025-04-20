import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { LoanProvider } from './contexts/LoanContext';
import PrivateRoute from './components/auth/PrivateRoute';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import EmployeeDashboard from './pages/employee/Dashboard';
import EmployeeProfile from './pages/employee/Profile';
import LoanApplication from './pages/employee/LoanApplication';
import LoanHistory from './pages/employee/LoanHistory';
import AdminDashboard from './pages/admin/Dashboard';
import EmployeeManagement from './pages/admin/EmployeeManagement';
import LoanPolicyManagement from './pages/admin/LoanPolicyManagement';
import LoanRequestManagement from './pages/admin/LoanRequestManagement';
import ReportsAnalytics from './pages/admin/ReportsAnalytics';

function App() {
  return (
    <Router>
      <AuthProvider>
        <LoanProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            
            {/* Employee Routes */}
            <Route path="/employee" element={<PrivateRoute role="employee" />}>
              <Route path="dashboard" element={<EmployeeDashboard />} />
              <Route path="profile" element={<EmployeeProfile />} />
              <Route path="apply" element={<LoanApplication />} />
              <Route path="history" element={<LoanHistory />} />
            </Route>
            
            {/* Admin Routes */}
            <Route path="/admin" element={<PrivateRoute role="admin" />}>
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="employees" element={<EmployeeManagement />} />
              <Route path="policies" element={<LoanPolicyManagement />} />
              <Route path="requests" element={<LoanRequestManagement />} />
              <Route path="reports" element={<ReportsAnalytics />} />
            </Route>
            
            {/* Redirect to login if not matched */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </LoanProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;