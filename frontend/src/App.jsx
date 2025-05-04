import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './AuthContext';
import './App.css';
import Navbar from './pages/Navbar';

// Placeholder imports for pages
const MerchantDashboard = React.lazy(() => import('./pages/MerchantDashboard'));
const UserDashboard = React.lazy(() => import('./pages/UserDashboard'));
const PlanCreate = React.lazy(() => import('./pages/PlanCreate'));
const Login = React.lazy(() => import('./pages/Login'));

function PrivateRoute({ children, role }) {
  const { user } = React.useContext(AuthContext);
  if (!user) return <Navigate to="/" />;
  if (role && user.role !== role) return <Navigate to="/" />;
  return children;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <React.Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/merchant/dashboard" element={<PrivateRoute role="merchant"><MerchantDashboard /></PrivateRoute>} />
            <Route path="/merchant/create-plan" element={<PrivateRoute role="merchant"><PlanCreate /></PrivateRoute>} />
            <Route path="/user/dashboard" element={<PrivateRoute role="user"><UserDashboard /></PrivateRoute>} />
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        </React.Suspense>
      </Router>
    </AuthProvider>
  );
}

export default App;
