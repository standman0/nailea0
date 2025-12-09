import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Auth Components
import Login from './components/auth/Login';
import Register from './components/auth/Register';

// Admin Components
import AdminDashboard from './components/admin/Dashboard';
import AdminAppointments from './components/admin/Appointments';
import AdminClients from './components/admin/Clients';
import AdminServices from './components/admin/Services';
import AdminSettings from './components/admin/Settings';
import AdminAnalytics from './components/admin/Analytics';
import AdminAppointmentDetail from './components/admin/AppointmentDetail';
import AdminNotifications from './components/admin/Notifications';
import AdminLayout from './components/admin/AdminLayout';

// Client Components
import BookingPage from './components/client/BookingPage';
import MyAppointments from './components/client/MyAppointments';

// Shared Components
import ProtectedRoute from './ProtectedRoute';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Client Routes */}
            <Route
              path="/book"
              element={
                <ProtectedRoute>
                  <BookingPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-appointments"
              element={
                <ProtectedRoute>
                  <MyAppointments />
                </ProtectedRoute>
              }
            />

            {/* Admin Routes */}
            <Route
              element={
                <ProtectedRoute adminOnly>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/appointments" element={<AdminAppointments />} />
              <Route path="/admin/appointments/:id" element={<AdminAppointmentDetail />} />
              <Route path="/admin/clients" element={<AdminClients />} />
              <Route path="/admin/services" element={<AdminServices />} />
              <Route path="/admin/settings" element={<AdminSettings />} />
              <Route path="/admin/analytics" element={<AdminAnalytics />} />
              <Route path="/admin/notifications" element={<AdminNotifications />} />
            </Route>

            {/* Redirect root to login */}
            <Route path="/" element={<Navigate to="/register" replace />} />

            {/* 404 Route */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
