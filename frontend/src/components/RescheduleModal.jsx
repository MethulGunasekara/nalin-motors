import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import './RescheduleModal.css';

const RescheduleModal = ({ appointment, onClose, onSubmit }) => {
  const { t } = useTranslation();
  const [serviceDate, setServiceDate] = useState(
    new Date(appointment.serviceDate).toISOString().split('T')[0]
  );
  const [startTime, setStartTime] = useState(appointment.startTime);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(appointment._id, { serviceDate, startTime });
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h3>{t('dashboard.reschedule')} — {appointment.vehicleNumber}</h3>
        <form onSubmit={handleSubmit}>
          <label>{t('appointment.serviceDate')}</label>
          <input type="date" value={serviceDate} onChange={(e) => setServiceDate(e.target.value)} required />
          <label>{t('appointment.startTime')}</label>
          <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} required />
          <div className="modal__actions">
            <button type="button" className="btn btn--outline-red" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn--red">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RescheduleModal;