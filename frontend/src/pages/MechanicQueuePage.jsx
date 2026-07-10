import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import StatusBadge from '../components/StatusBadge';
import SearchBar from '../components/SearchBar';
import { getServiceCards } from '../api/serviceCards';
import { matchesSearch } from '../utils/search';
import { useLogout } from '../utils/useLogout';
import './MechanicQueuePage.css';

const isSameDay = (dateA, dateB) =>
  new Date(dateA).toDateString() === new Date(dateB).toDateString();

const MechanicQueuePage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const handleLogout = useLogout();
  const employee = JSON.parse(localStorage.getItem('nalin_employee') || '{}');
  const [cards, setCards] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const load = async () => {
      const { data } = await getServiceCards({ mechanic: employee._id });
      setCards(data.filter((c) => c.status !== 'Completed'));
    };
    load();
  }, []);

  const filtered = useMemo(
    () => cards.filter((c) => matchesSearch(c, search)),
    [cards, search]
  );

  return (
    <div>
      <Header employeeName={employee.name} onLogout={handleLogout} />
      <main className="mechanic-queue">
        <h2>{t('serviceCard.title')}</h2>
        <SearchBar value={search} onChange={setSearch} />

        {filtered.length === 0 && (
          <p className="mechanic-queue__empty">
            {search ? t('dashboard.noResults') : '—'}
          </p>
        )}

        {filtered.map((card) => {
          const today =
            card.appointment?.serviceDate &&
            isSameDay(card.appointment.serviceDate, new Date());
          return (
            <div
              key={card._id}
              className={`mechanic-queue__card ${today ? 'mechanic-queue__card--today' : ''}`}
              onClick={() => navigate(`/service-cards/${card._id}`)}
            >
              {today && (
                <span className="mechanic-queue__today-tag">
                  {t('dashboard.todayTag')}
                </span>
              )}
              <div className="mechanic-queue__row">
                <span className="mechanic-queue__vehicle">{card.vehicleNumber}</span>
                <StatusBadge status={card.status} />
              </div>
              {card.appointment?.serviceDate && (
                <div className="mechanic-queue__date">
                  {new Date(card.appointment.serviceDate).toLocaleDateString()} ·{' '}
                  {card.appointment.startTime}
                </div>
              )}
            </div>
          );
        })}
      </main>
    </div>
  );
};

export default MechanicQueuePage;