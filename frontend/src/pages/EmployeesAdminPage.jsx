import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Header from '../components/Header';
import AdminNav from '../components/AdminNav';
import { getAllEmployees, createEmployee, updateEmployee } from '../api/employeesAdmin';
import { useLogout } from '../utils/useLogout';
import './AdminPage.css';

const EmployeesAdminPage = () => {
  const { t } = useTranslation();
  const handleLogout = useLogout();
  const employee = JSON.parse(localStorage.getItem('nalin_employee') || '{}');

  const [employees, setEmployees] = useState([]);
  const [form, setForm] = useState({ name: '', role: 'cashier', phone: '', password: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const load = async () => {
    const { data } = await getAllEmployees();
    setEmployees(data);
  };

  useEffect(() => {
    load();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await createEmployee(form);
      setForm({ name: '', role: 'cashier', phone: '', password: '' });
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  const toggleActive = async (emp) => {
    await updateEmployee(emp._id, { active: !emp.active });
    load();
  };

  return (
    <div>
      <Header employeeName={employee.name} onLogout={handleLogout} />
      <AdminNav />
      <main className="admin-page">
        <h2>{t('nav.employees')}</h2>

        <form className="admin-page__form" onSubmit={handleSubmit}>
          <input
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={handleChange}
            required
          />
          <select name="role" value={form.role} onChange={handleChange}>
            <option value="cashier">Cashier</option>
            <option value="mechanic">Mechanic</option>
            <option value="owner">Owner</option>
          </select>
          <input
            name="phone"
            placeholder="Phone"
            value={form.phone}
            onChange={handleChange}
            required
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />
          <button type="submit" className="btn btn--red" disabled={submitting}>
            {submitting ? '...' : '+ Add'}
          </button>
        </form>
        {error && <p className="admin-page__error">{error}</p>}

        <div className="admin-page__list">
          {employees.map((emp) => (
            <div key={emp._id} className="admin-page__row">
              <div>
                <strong>{emp.name}</strong>
                <span className="admin-page__meta">
                  {' '}· {emp.role} · {emp.phone}
                </span>
              </div>
              <button
                className={emp.active ? 'btn btn--outline-red' : 'btn btn--green'}
                onClick={() => toggleActive(emp)}
              >
                {emp.active ? 'Deactivate' : 'Activate'}
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default EmployeesAdminPage;