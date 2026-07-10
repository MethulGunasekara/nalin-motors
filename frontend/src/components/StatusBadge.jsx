import { useTranslation } from 'react-i18next';
import './StatusBadge.css';

const STATUS_COLOR_CLASS = {
  Booked: 'badge--muted',
  Confirmed: 'badge--purple',
  Rescheduled: 'badge--blue',
  Cancelled: 'badge--red',
  Completed: 'badge--green',
  Pending: 'badge--muted',
  'In Progress': 'badge--blue',
};

const StatusBadge = ({ status }) => {
  const { t } = useTranslation();
  const colorClass = STATUS_COLOR_CLASS[status] || 'badge--muted';

  return <span className={`badge ${colorClass}`}>{t(`status.${status}`)}</span>;
};

export default StatusBadge;