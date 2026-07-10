import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import SearchBar from '../components/SearchBar';
import AppointmentCard from '../components/AppointmentCard';
import RescheduleModal from '../components/RescheduleModal';
import {
  getTodayAppointments,
  getUpcomingAppointments,
  confirmArrival,
  updateAppointment,
  cancelAppointment,
} from '../api/appointments';
import { matchesSearch } from '../utils/search';
import './DashboardPage.css';

const DashboardPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const employee = JSON.parse(localStorage.getItem('nalin_employee') || '{}');

  const [todayList, setTodayList] = useState([]);
  const [upcomingList, setUpcomingList] = useState([]);
  const [reschedulingAppt, setReschedulingAppt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const loadAppointments = async () => {
    setLoading(true);
    const [todayRes, upcomingRes] = await Promise.all([
      getTodayAppointments(),
      getUpcomingAppointments(),
    ]);
    setTodayList(todayRes.data);
    setUpcomingList(upcomingRes.data);
    setLoading(false);
  };

  useEffect(() => {
    loadAppointments();
  }, []);

  const filteredToday = useMemo(
    () => todayList.filter((a) => matchesSearch(a, search)),
    [todayList, search]
  );
  const filteredUpcoming = useMemo(
    () => upcomingList.filter((a) => matchesSearch(a, search)),
    [upcomingList, search]
  );

  // Group upcoming appointments by date so each day's batch is clearly separated.
  const upcomingByDate = useMemo(() => {
    const groups = new Map();
    filteredUpcoming.forEach((appt) => {
      const key = new Date(appt.serviceDate).toDateString();
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push(appt);
    });
    return Array.from(groups.entries());
  }, [filteredUpcoming]);

  const handleLogout = () => {
    localStorage.removeItem('nalin_token');
    localStorage.removeItem('nalin_employee');
    navigate('/login');
  };

  const handleConfirmArrival = async (appointment) => {
    await confirmArrival(appointment._id);
    loadAppointments();
  };

  const handleCancel = async (appointment) => {
    if (window.confirm(`Cancel appointment for ${appointment.vehicleNumber}?`)) {
      await cancelAppointment(appointment._id);
      loadAppointments();
    }
  };

  const handleRescheduleSubmit = async (id, data) => {
    await updateAppointment(id, data);
    setReschedulingAppt(null);
    loadAppointments();
  };

  const handleCreateCard = (appointment) => {
    navigate(`/service-cards/new?appointmentId=${appointment._id}`);
  };

  const handleViewCard = (serviceCardId) => {
    navigate(`/service-cards/${serviceCardId}`);
  };

  return (
    <div>
      <Header employeeName={employee.name} onLogout={handleLogout} />
      <main className="dashboard">
        <div className="dashboard__header-row">
          <h2>{t('dashboard.today')}</h2>
          <button className="btn btn--red" onClick={() => navigate('/appointments/new')}>
            + {t('nav.newAppointment')}
          </button>
        </div>

        <SearchBar value={search} onChange={setSearch} />

        {!loading && filteredToday.length === 0 && (
          <p className="dashboard__empty">{search ? t('dashboard.noResults') : t('dashboard.noneToday')}</p>
        )}
        {filteredToday.map((appt) => (
          <AppointmentCard
            key={appt._id}
            appointment={appt}
            isToday
            onConfirmArrival={handleConfirmArrival}
            onReschedule={setReschedulingAppt}
            onCancel={handleCancel}
            onCreateCard={handleCreateCard}
            onViewCard={handleViewCard}
          />
        ))}

        <h2 className="dashboard__section-spaced">{t('dashboard.upcoming')}</h2>
        {!loading && upcomingByDate.length === 0 && (
          <p className="dashboard__empty">{search ? t('dashboard.noResults') : t('dashboard.noneUpcoming')}</p>
        )}
        {upcomingByDate.map(([dateKey, appts]) => (
          <div key={dateKey} className="dashboard__date-group">
            <div className="dashboard__date-label">{new Date(dateKey).toLocaleDateString()}</div>
            {appts.map((appt) => (
              <AppointmentCard
                key={appt._id}
                appointment={appt}
                onConfirmArrival={handleConfirmArrival}
                onReschedule={setReschedulingAppt}
                onCancel={handleCancel}
                onCreateCard={handleCreateCard}
                onViewCard={handleViewCard}
              />
            ))}
          </div>
        ))}
      </main>

      {reschedulingAppt && (
        <RescheduleModal
          appointment={reschedulingAppt}
          onClose={() => setReschedulingAppt(null)}
          onSubmit={handleRescheduleSubmit}
        />
      )}
    </div>
  );
};

export default DashboardPage;