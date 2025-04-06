// App.jsx
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage/HomePage';
import Login from './pages/Login/Login';
import EmployeeDashboard from './pages/Dashboard/Employee/EmployeeDashboard';
import AdminDashboard from './pages/Dashboard/Admin/AdminDashboard';
import ProtectedRoute from './pages/ProtectedRoute/ProtectedRoute';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState('');

  const handleLogin = (role) => {
    setIsAuthenticated(true);
    setUserRole(role);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserRole('');
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />

        <Route
          path="/login"
          element={
            isAuthenticated ? (
              userRole === 'admin' ? (
                <Navigate to="/admin-dashboard" replace />
              ) : (
                <Navigate to="/employee-dashboard" replace />
              )
            ) : (
              <Login onLoginSuccess={handleLogin} />
            )
          }
        />

        <Route
          path="/employee-dashboard/*"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated && userRole === 'employee'}>
              <EmployeeDashboard onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin-dashboard/*"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated && userRole === 'admin'}>
              <AdminDashboard onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
