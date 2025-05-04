import React, { useState, useContext } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext';

export default function PlanCreate() {
  const { token } = useContext(AuthContext);
  const [form, setForm] = useState({
    total_amount: '',
    user_email: '',
    num_installments: 4,
    start_date: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await api.post('plans/', form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess('Plan created!');
      setTimeout(() => navigate('/merchant/dashboard'), 1000);
    } catch (err) {
      setError(err.response?.data?.user_email || 'Error creating plan');
    }
  };

  return (
    <div className="app-container" style={{ maxWidth: 500 }}>
      <h2>Create BNPL Plan</h2>
      <form onSubmit={handleSubmit} style={{ marginTop: 16 }}>
        <input
          type="number"
          name="total_amount"
          placeholder="Total Amount"
          value={form.total_amount}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="user_email"
          placeholder="User Email"
          value={form.user_email}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="num_installments"
          placeholder="Number of Installments"
          value={form.num_installments}
          min={1}
          onChange={handleChange}
          required
        />
        <input
          type="date"
          name="start_date"
          placeholder="Start Date"
          value={form.start_date}
          onChange={handleChange}
          required
        />
        <button type="submit">Create Plan</button>
        {error && <div className="form-error">{error}</div>}
        {success && <div className="form-success">{success}</div>}
      </form>
    </div>
  );
}
