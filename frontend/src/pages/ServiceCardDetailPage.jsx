import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Header from '../components/Header';
import StatusBadge from '../components/StatusBadge';
import { getServiceCardById, updateServiceCardStatus, updateChecklistItem } from '../api/serviceCards';
import { downloadServiceCardPdf } from '../utils/downloadServiceCardPdf';
import { useLogout } from '../utils/useLogout';
import './ServiceCardDetailPage.css';

const ServiceCardDetailPage = () => {
  const { id } = useParams();
  const { t, i18n } = useTranslation();
  const handleLogout = useLogout();
  const employee = JSON.parse(localStorage.getItem('nalin_employee') || '{}');
  const isMechanic = employee.role === 'mechanic';

  const [card, setCard] = useState(null);
  const [downloading, setDownloading] = useState(false);
  const printRef = useRef(null);

  const load = async () => {
    const { data } = await getServiceCardById(id);
    setCard(data);
  };

  useEffect(() => {
    load();
  }, [id]);

  const handleStatusChange = async (status) => {
    await updateServiceCardStatus(id, status);
    load();
  };

  const handlePrint = () => window.print();

  const handleDownload = async () => {
    if (!printRef.current) return;
    setDownloading(true);
    try {
      await downloadServiceCardPdf(
        printRef.current,
        `service-card-${card.vehicleNumber}.pdf`
      );
    } finally {
      setDownloading(false);
    }
  };

  const handleToggleCatalogItem = async (index, current) => {
    await updateChecklistItem(id, { checklistIndex: index, completed: !current });
    load();
  };

  const handleToggleCustomItem = async (index, current) => {
    await updateChecklistItem(id, { customIndex: index, completed: !current });
    load();
  };

  if (!card) return null;

  const label = (item) =>
    i18n.language === 'si' && item.serviceNameSi
      ? item.serviceNameSi
      : item.serviceNameEn;

  return (
    <div>
      <div className="no-print">
        <Header employeeName={employee.name} onLogout={handleLogout} />
      </div>

      <main className="service-card-view">
        <div className="service-card-view__actions no-print">
          <button className="btn btn--blue" onClick={handlePrint}>
            {t('serviceCard.print')}
          </button>
          <button
            className="btn btn--blue"
            onClick={handleDownload}
            disabled={downloading}
          >
            {downloading ? '...' : t('serviceCard.download')}
          </button>
          {(isMechanic || employee.role === 'cashier') && card.status === 'Pending' && (
            <button
              className="btn btn--blue"
              onClick={() => handleStatusChange('In Progress')}
            >
              {t('serviceCard.markInProgress')}
            </button>
          )}
          {(isMechanic || employee.role === 'cashier') && card.status !== 'Completed' && (
            <button
              className="btn btn--green"
              onClick={() => handleStatusChange('Completed')}
            >
              {t('serviceCard.markCompleted')}
            </button>
          )}
        </div>

        <div className="print-sheet" ref={printRef}>
          <div className="print-sheet__header">
            <h2>{t('serviceCard.title')}</h2>
            <StatusBadge status={card.status} />
          </div>

          <table className="print-sheet__meta">
            <tbody>
              <tr>
                <td>{t('appointment.vehicleNumber')}</td>
                <td>{card.vehicleNumber}</td>
                <td>{t('serviceCard.brand')} / {t('serviceCard.model')}</td>
                <td>{card.brand} {card.model}</td>
              </tr>
              <tr>
                <td>{t('appointment.customerMobile')}</td>
                <td>{card.customerMobile}</td>
                <td>{t('serviceCard.mechanic')}</td>
                <td>{card.mechanic?.name}</td>
              </tr>
              <tr>
                <td>{t('serviceCard.inspectingOfficer')}</td>
                <td>{card.inspectingOfficer?.name}</td>
                <td></td>
                <td></td>
              </tr>
            </tbody>
          </table>

          <h3>{t('serviceCard.checklist')}</h3>

          {card.checklist.length === 0 && (
            <p className="print-sheet__none">—</p>
          )}

          <ul className="print-sheet__checklist">
            {card.checklist.map((entry, i) => (
              <li key={entry.catalogItem._id} className="print-sheet__checklist-item">
                {/* Screen view — mechanic gets interactive checkbox, others see state */}
                <span className="no-print">
                  {isMechanic ? (
                    <input
                      type="checkbox"
                      className="mechanic-check"
                      checked={entry.completedByMechanic}
                      onChange={() => handleToggleCatalogItem(i, entry.completedByMechanic)}
                    />
                  ) : (
                    <span className="check-indicator">
                      {entry.completedByMechanic ? '☑' : '☐'}
                    </span>
                  )}
                </span>
                {/* Print view — always an empty printed box */}
                <span className="print-only print-checkbox">☐</span>
                <span className="checklist-label">{label(entry.catalogItem)}</span>
              </li>
            ))}
          </ul>

          {card.customServices.length > 0 && (
            <>
              <h3>{t('serviceCard.addCustomService')}</h3>
              <ul className="print-sheet__checklist">
                {card.customServices.map((service, i) => (
                  <li key={i} className="print-sheet__checklist-item">
                    <span className="no-print">
                      {isMechanic ? (
                        <input
                          type="checkbox"
                          className="mechanic-check"
                          checked={service.completedByMechanic}
                          onChange={() => handleToggleCustomItem(i, service.completedByMechanic)}
                        />
                      ) : (
                        <span className="check-indicator">
                          {service.completedByMechanic ? '☑' : '☐'}
                        </span>
                      )}
                    </span>
                    <span className="print-only print-checkbox">☐</span>
                    <span className="checklist-label">{service.name}</span>
                  </li>
                ))}
              </ul>
            </>
          )}

          {card.notes && (
            <>
              <h3>{t('serviceCard.notes')}</h3>
              <p className="print-sheet__notes">{card.notes}</p>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default ServiceCardDetailPage;