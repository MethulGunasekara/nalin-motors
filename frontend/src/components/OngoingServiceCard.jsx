import { useTranslation } from 'react-i18next';
import StatusBadge from './StatusBadge';
import './OngoingServiceCard.css';

const OngoingServiceCard = ({ card, onClick }) => {
  const { t, i18n } = useTranslation();

  const serviceDate = card.appointment?.serviceDate
    ? new Date(card.appointment.serviceDate).toLocaleDateString()
    : '—';

  const completedCount = [
    ...card.checklist.filter((e) => e.completedByMechanic),
    ...card.customServices.filter((e) => e.completedByMechanic),
  ].length;

  const totalCount = card.checklist.length + card.customServices.length;

  return (
    <div className="ongoing-card" onClick={onClick}>
      <div className="ongoing-card__top">
        <span className="ongoing-card__vehicle">{card.vehicleNumber}</span>
        <StatusBadge status={card.status} />
      </div>
      <div className="ongoing-card__meta">
        <span>{card.mechanic?.name}</span>
        <span>{serviceDate}</span>
      </div>
      {totalCount > 0 && (
        <div className="ongoing-card__progress">
          <div className="ongoing-card__progress-bar">
            <div
              className="ongoing-card__progress-fill"
              style={{ width: `${Math.round((completedCount / totalCount) * 100)}%` }}
            />
          </div>
          <span className="ongoing-card__progress-label">
            {completedCount} / {totalCount} {t('serviceCard.done')}
          </span>
        </div>
      )}
    </div>
  );
};

export default OngoingServiceCard;