import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import AdminNav from '../components/AdminNav';
import SearchBar from '../components/SearchBar';
import AppointmentCard from '../components/AppointmentCard';
import { getAllAppointments } from '../api/appointments';
import { matchesSearch } from '../utils/search';
import { useLogout } from '../utils/useLogout';
import './DashboardPage.css';

const isSameDay = (dateA, dateB) =>
  new Date(dateA).toDateString() === new Date(dateB).toDateString();

const AdminAppointmentsPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const handleLogout = useLogout();
  const employee = JSON.parse(localStorage.getItem('nalin_employee') || '{}');

  const [appointments, setAppointments] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const { data } = await getAllAppointments();
      setAppointments(data);
      setLoading(false);
    };
    load();
  }, []);

  const filtered = useMemo(
    () => appointments.filter((a) => matchesSearch(a, search)),
    [appointments, search]
  );

  const handleViewCard = (serviceCardId) => navigate(`/service-cards/${serviceCardId}`);

  return (
    <div>
      <Header employeeName={employee.name} onLogout={handleLogout} />
      <AdminNav />
      <main className="dashboard">
        <h2>{t('nav.dashboard')}</h2>
        <SearchBar value={search} onChange={setSearch} />

        {!loading && filtered.length === 0 && (
          <p className="dashboard__empty">
            {search ? t('dashboard.noResults') : t('dashboard.noneUpcoming')}
          </p>
        )}

        {filtered.map((appt) => (
          <AppointmentCard
            key={appt._id}
            appointment={appt}
            isToday={isSameDay(appt.serviceDate, new Date())}
            readOnly
            onViewCard={handleViewCard}
          />
        ))}
      </main>
    </div>
  );
};

export default AdminAppointmentsPage;