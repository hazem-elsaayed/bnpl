import React, { useEffect, useState, useContext } from 'react';
import api from '../api';
import { AuthContext } from '../AuthContext';

const statusClass = {
  'Pending': 'status-badge status-pending',
  'Paid': 'status-badge status-paid',
  'Late': 'status-badge status-late',
};

export default function UserDashboard() {
  const { token } = useContext(AuthContext);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(null);

  const fetchPlans = async () => {
    setLoading(true);
    try {
      const res = await api.get('plans/', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPlans(res.data);
    } catch (err) {
      console.error('Error fetching plans:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
    // eslint-disable-next-line
  }, [token]);

  const handlePay = async (installmentId) => {
    setPaying(installmentId);
    try {
      await api.post(`installments/${installmentId}/pay/`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      await fetchPlans();
    } catch (err) {
      console.error('Error processing payment:', err);
    } finally {
      setPaying(null);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="app-container">
      <h2>User Dashboard</h2>
      {plans.map(plan => (
        <div key={plan.id} style={{ marginBottom: 30, border: '1px solid #e0e0e0', borderRadius: 8, padding: 16, background: '#fafbfc' }}>
          <div style={{ marginBottom: 10 }}><strong>Plan:</strong> {plan.total_amount} ريال | <strong>Status:</strong> <span className={statusClass[plan.status]}>{plan.status}</span></div>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Amount</th>
                  <th>Due Date</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {plan.installments.map(inst => (
                  <tr key={inst.id}>
                    <td>{inst.amount} ريال</td>
                    <td>{inst.due_date}</td>
                    <td><span className={statusClass[inst.status]}>{inst.status}</span></td>
                    <td>
                      {['Pending', 'Late'].includes(inst.status) && (
                        <button onClick={() => handlePay(inst.id)} disabled={paying === inst.id}>
                          {paying === inst.id ? 'Paying...' : 'Pay Now'}
                        </button>
                      )}
                      {inst.status === 'Paid' && <span>Paid</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
}
