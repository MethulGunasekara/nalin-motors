import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Header from '../components/Header';
import { getServiceCatalog, getEmployeesByRole } from '../api/catalogAndEmployees';
import { createServiceCard } from '../api/serviceCards';
import { useLogout } from '../utils/useLogout';
import './ServiceCardFormPage.css';

const ServiceCardFormPage = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const handleLogout = useLogout();
  const [searchParams] = useSearchParams();
  const appointmentId = searchParams.get('appointmentId');
  const employee = JSON.parse(localStorage.getItem('nalin_employee') || '{}');

  const [catalog, setCatalog] = useState([]);
  const [cashiers, setCashiers] = useState([]);
  const [mechanics, setMechanics] = useState([]);

  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [inspectingOfficer, setInspectingOfficer] = useState('');
  const [mechanic, setMechanic] = useState('');
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [customServices, setCustomServices] = useState([]);
  const [customInput, setCustomInput] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const load = async () => {
      const [catalogRes, cashierRes, mechanicRes] = await Promise.all([
        getServiceCatalog(),
        getEmployeesByRole('cashier'),
        getEmployeesByRole('mechanic'),
      ]);
      setCatalog(catalogRes.data);
      setCashiers(cashierRes.data);
      setMechanics(mechanicRes.data);
      if (employee.role === 'cashier') setInspectingOfficer(employee._id);
    };
    load();
  }, []);

  const toggleChecklistItem = (id) => {
    const next = new Set(selectedIds);
    next.has(id) ? next.delete(id) : next.add(id);
    setSelectedIds(next);
  };

  const addCustomService = () => {
    if (customInput.trim()) {
      setCustomServices([...customServices, customInput.trim()]);
      setCustomInput('');
    }
  };

  const removeCustomService = (index) => {
    setCustomServices(customServices.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!appointmentId) {
      setError('Missing appointment reference.');
      return;
    }
    if (!inspectingOfficer || !mechanic) {
      setError('Please select both an inspecting officer and a mechanic.');
      return;
    }

    setSubmitting(true);
    try {
      await createServiceCard({
        appointmentId,
        brand,
        model,
        inspectingOfficer,
        mechanic,
        selectedCatalogItemIds: Array.from(selectedIds),
        customServices,
        notes,
      });
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
      <main className="card-form">
        <h2>{t('serviceCard.title')}</h2>
        <form onSubmit={handleSubmit}>
          <label>{t('serviceCard.brand')}</label>
          <input value={brand} onChange={(e) => setBrand(e.target.value)} />

          <label>{t('serviceCard.model')}</label>
          <input value={model} onChange={(e) => setModel(e.target.value)} />

          <label>{t('serviceCard.inspectingOfficer')}</label>
          <select
            value={inspectingOfficer}
            onChange={(e) => setInspectingOfficer(e.target.value)}
            required
          >
            <option value="">—</option>
            {cashiers.map((c) => (
              <option key={c._id} value={c._id}>{c.name}</option>
            ))}
          </select>

          <label>{t('serviceCard.mechanic')}</label>
          <select
            value={mechanic}
            onChange={(e) => setMechanic(e.target.value)}
            required
          >
            <option value="">—</option>
            {mechanics.map((m) => (
              <option key={m._id} value={m._id}>{m.name}</option>
            ))}
          </select>

          <label>{t('serviceCard.checklist')}</label>
          <div className="checklist">
            {catalog.map((item) => (
              <label key={item._id} className="checklist__item">
                <input
                  type="checkbox"
                  checked={selectedIds.has(item._id)}
                  onChange={() => toggleChecklistItem(item._id)}
                />
                {i18n.language === 'si' && item.serviceNameSi
                  ? item.serviceNameSi
                  : item.serviceNameEn}
              </label>
            ))}
          </div>

          <label>{t('serviceCard.addCustomService')}</label>
          <div className="custom-service-row">
            <input
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              placeholder="e.g. Replace clutch cable"
            />
            <button type="button" className="btn btn--blue" onClick={addCustomService}>
              +
            </button>
          </div>
          <ul className="custom-service-list">
            {customServices.map((service, i) => (
              <li key={i}>
                {service}
                <button type="button" onClick={() => removeCustomService(i)}>×</button>
              </li>
            ))}
          </ul>

          <label>{t('serviceCard.notes')}</label>
          <textarea
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />

          {error && <p className="card-form__error">{error}</p>}

          <button type="submit" className="btn btn--red" disabled={submitting}>
            {submitting ? '...' : t('dashboard.createCard')}
          </button>
        </form>
      </main>
    </div>
  );
};

export default ServiceCardFormPage;