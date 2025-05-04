import React, { useState, useContext } from 'react';
import api from '../api';
import { useNavigate, Navigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, user } = useContext(AuthContext);
  const navigate = useNavigate();

  if (user) {
    if (user.role === 'merchant') return <Navigate to="/merchant/dashboard" />;
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
      login(res.data.access, res.data.refresh);
      const payload = JSON.parse(atob(res.data.access.split('.')[1]));
      if (payload.role === 'merchant') {
        navigate('/merchant/dashboard');
      } else if (payload.role === 'user') {
        navigate('/user/dashboard');
      } else {
        setError('Unknown user role.');
      }
    } catch (err) {
      console.error(err);
      setError('Invalid credentials');
    }
  };

  return (
    <div className="app-container" style={{ maxWidth: 600 }}>
      <div style={{ marginBottom: 24, textAlign: 'center' }}>
        <h1 style={{ fontWeight: 700, fontSize: 22, color: '#1a237e', marginBottom: 6 }}>
          BNPL Payment Plan Simulator
        </h1>
        <div style={{ color: '#444', fontSize: 15, maxWidth: 420, margin: '0 auto' }}>
          A dashboard for merchants and users to manage Buy Now, Pay Later plans. Merchants can create and track plans, users can view and pay installments. Secure, simple, and modern.
        </div>
      </div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit} style={{ marginTop: 16 }}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
        {error && <div className="form-error">{error}</div>}
      </form>
    </div>
  );
}
