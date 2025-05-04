import React, { useContext } from 'react';
import { AuthContext } from '../AuthContext';
import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <nav className="navbar">
      <div className="nav-left">
        {user.role === 'merchant' && <Link to="/merchant/dashboard">Dashboard</Link>}
        {user.role === 'merchant' && <Link to="/merchant/create-plan">Create Plan</Link>}
        {user.role === 'user' && <Link to="/user/dashboard">Dashboard</Link>}
      </div>
      <div className="nav-right">
        <span className="user-info">{user.username} ({user.role})</span>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
}
