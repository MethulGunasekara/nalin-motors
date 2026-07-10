import { useTranslation } from 'react-i18next';
import StatusBadge from './StatusBadge';
import './AppointmentCard.css';

const AppointmentCard = ({
  appointment,
  isToday,
  readOnly,
  onConfirmArrival,
  onReschedule,
  onCancel,
  onCreateCard,
  onViewCard,
}) => {
  const { t } = useTranslation();
  const { vehicleNumber, customerMobile, serviceDate, startTime, status, serviceCardId } = appointment;

  const dateLabel = new Date(serviceDate).toLocaleDateString();
  const clickableCard = Boolean(serviceCardId);

  const handleCardClick = () => {
    if (clickableCard) onViewCard(serviceCardId);
  };

  const stopBubble = (e) => e.stopPropagation();

  return (
    <div
      className={`appt-card ${isToday ? 'appt-card--today' : ''} ${clickableCard ? 'appt-card--clickable' : ''}`}
      onClick={handleCardClick}
    >
      {isToday && <span className="appt-card__today-tag">{t('dashboard.todayTag')}</span>}

      <div className="appt-card__top">
        <span className="appt-card__vehicle">{vehicleNumber}</span>
        <StatusBadge status={status} />
      </div>

      <div className="appt-card__details">
        <span>{customerMobile}</span>
        <span>{dateLabel} · {startTime}</span>
      </div>

      {!readOnly && (
        <div className="appt-card__actions" onClick={stopBubble}>
          {(status === 'Booked' || status === 'Rescheduled') && (
            <>
              <button className="btn btn--green" onClick={() => onConfirmArrival(appointment)}>
                {t('dashboard.confirmArrival')}
              </button>
              <button className="btn btn--blue" onClick={() => onReschedule(appointment)}>
                {t('dashboard.reschedule')}
              </button>
              <button className="btn btn--outline-red" onClick={() => onCancel(appointment)}>
                {t('dashboard.cancel')}
              </button>
            </>
          )}

          {status === 'Confirmed' && !serviceCardId && (
            <button className="btn btn--red" onClick={() => onCreateCard(appointment)}>
              {t('dashboard.createCard')}
            </button>
          )}

          {serviceCardId && (
            <button className="btn btn--blue" onClick={() => onViewCard(serviceCardId)}>
              {t('dashboard.viewCard')}
            </button>
          )}
        </div>
      )}

      {readOnly && clickableCard && (
        <div className="appt-card__readonly-hint">{t('dashboard.viewCard')} →</div>
      )}
    </div>
  );
};

export default AppointmentCard;