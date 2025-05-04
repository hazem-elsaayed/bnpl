import React, { useState, useContext } from 'react';
import api from '../api';
import { useNavigate, Navigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext';

export default function UserLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, user } = useContext(AuthContext);
  const navigate = useNavigate();

  if (user) {
    // If logged in as merchant, redirect to merchant dashboard
    if (user.role === 'merchant') return <Navigate to="/merchant/dashboard" />;
    // If logged in as user, redirect to user dashboard
    if (user.role === 'user') return <Navigate to="/user/dashboard" />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await api.post('token/', {
        username,
        password,
      });
      login(res.data.access);
      // Decode token to check role
      const payload = JSON.parse(atob(res.data.access.split('.')[1]));
      if (payload.role === 'user') {
        navigate('/user/dashboard');
      } else {
        setError('Not a user account.');
      }
    } catch (err) {
      setError('Invalid credentials');
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: 'auto', padding: 20 }}>
      <h2>User Login</h2>
      <div style={{ marginBottom: 10 }}>
        <a href="/merchant/login">Merchant Login</a>
      </div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          required
          style={{ width: '100%', marginBottom: 10 }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          style={{ width: '100%', marginBottom: 10 }}
        />
        <button type="submit" style={{ width: '100%' }}>Login</button>
        {error && <div style={{ color: 'red', marginTop: 10 }}>{error}</div>}
      </form>
    </div>
  );
}
