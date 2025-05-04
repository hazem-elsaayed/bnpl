import React, { useEffect, useState, useContext } from 'react';
import api from '../api';
import { AuthContext } from '../AuthContext';
import { Link } from 'react-router-dom';

const statusClass = {
  'Pending': 'status-badge status-pending',
  'Paid': 'status-badge status-paid',
  'Late': 'status-badge status-late',
};

export default function MerchantDashboard() {
  const { token } = useContext(AuthContext);
  const [plans, setPlans] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const plansRes = await api.get('plans/', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPlans(plansRes.data);
        const analyticsRes = await api.get('analytics/', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAnalytics(analyticsRes.data);
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [token]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="app-container">
      <h2>Merchant Dashboard</h2>
      <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link to="/merchant/create-plan" style={{ fontWeight: 500, fontSize: 16 }}>+ Create New BNPL Plan</Link>
        {analytics && (
          <div style={{ fontSize: 15 }}>
            <strong>Total Revenue:</strong> {analytics.total_revenue} ريال |{' '}
            <strong>Overdue Plans:</strong> {analytics.overdue_plans} |{' '}
            <strong>Success Rate:</strong> {analytics.success_rate}%
          </div>
        )}
      </div>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>User</th>
              <th>Total Amount</th>
              <th>Start Date</th>
              <th>Status</th>
              <th>Progress</th>
            </tr>
          </thead>
          <tbody>
            {plans.map(plan => {
              const paid = plan.installments.filter(i => i.status === 'Paid').length;
              const total = plan.installments.length;
              return (
                <tr key={plan.id}>
                  <td>{plan.user.email}</td>
                  <td>{plan.total_amount} ريال</td>
                  <td>{plan.start_date}</td>
                  <td>
                    <span className={statusClass[plan.status]}>{plan.status}</span>
                  </td>
                  <td>
                    <div className="progress-bar">
                      <div className="progress-bar-inner" style={{ width: `${(paid/total)*100}%` }} />
                    </div>
                    <span style={{ fontSize: 12 }}>{paid}/{total} paid</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
