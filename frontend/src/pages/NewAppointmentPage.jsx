import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { createAppointment } from '../api/appointments';
import { useLogout } from '../utils/useLogout';
import './NewAppointmentPage.css';

const NewAppointmentPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const handleLogout = useLogout();
  const employee = JSON.parse(localStorage.getItem('nalin_employee') || '{}');

  const [form, setForm] = useState({
    vehicleNumber: '',
    customerMobile: '',
    serviceDate: '',
    startTime: '',
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await createAppointment(form);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <Header employeeName={employee.name} onLogout={handleLogout} />
      <main className="new-appt-page">
        <h2>{t('nav.newAppointment')}</h2>
        <form onSubmit={handleSubmit}>
          <label>{t('appointment.vehicleNumber')}</label>
          <input
            name="vehicleNumber"
            value={form.vehicleNumber}
            onChange={handleChange}
            required
          />

          <label>{t('appointment.customerMobile')}</label>
          <input
            name="customerMobile"
            value={form.customerMobile}
            onChange={handleChange}
            required
          />

          <label>{t('appointment.serviceDate')}</label>
          <input
            type="date"
            name="serviceDate"
            value={form.serviceDate}
            onChange={handleChange}
            required
          />

          <label>{t('appointment.startTime')}</label>
          <input
            type="time"
            name="startTime"
            value={form.startTime}
            onChange={handleChange}
            required
          />

          {error && <p className="new-appt-page__error">{error}</p>}

          <button type="submit" className="btn btn--red" disabled={submitting}>
            {submitting ? '...' : t('appointment.submit')}
          </button>
        </form>
      </main>
    </div>
  );
};

export default NewAppointmentPage;