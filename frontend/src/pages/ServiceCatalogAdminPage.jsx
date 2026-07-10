import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Header from '../components/Header';
import AdminNav from '../components/AdminNav';
import { getCatalog, createCatalogItem, updateCatalogItem } from '../api/serviceCatalogAdmin';
import { useLogout } from '../utils/useLogout';
import './AdminPage.css';

const ServiceCatalogAdminPage = () => {
  const { t } = useTranslation();
  const handleLogout = useLogout();
  const employee = JSON.parse(localStorage.getItem('nalin_employee') || '{}');

  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ serviceNameEn: '', serviceNameSi: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const load = async () => {
    const { data } = await getCatalog();
    setItems(data);
  };

  useEffect(() => {
    load();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await createCatalogItem(form);
      setForm({ serviceNameEn: '', serviceNameSi: '' });
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  const toggleActive = async (item) => {
    await updateCatalogItem(item._id, { active: !item.active });
    load();
  };

  return (
    <div>
      <Header employeeName={employee.name} onLogout={handleLogout} />
      <AdminNav />
      <main className="admin-page">
        <h2>{t('nav.catalog')}</h2>

        <form className="admin-page__form" onSubmit={handleSubmit}>
          <input
            name="serviceNameEn"
            placeholder="Service name (English)"
            value={form.serviceNameEn}
            onChange={handleChange}
            required
          />
          <input
            name="serviceNameSi"
            placeholder="Service name (Sinhala)"
            value={form.serviceNameSi}
            onChange={handleChange}
          />
          <button type="submit" className="btn btn--red" disabled={submitting}>
            {submitting ? '...' : '+ Add'}
          </button>
        </form>
        {error && <p className="admin-page__error">{error}</p>}

        <div className="admin-page__list">
          {items.map((item) => (
            <div key={item._id} className="admin-page__row">
              <div>
                <strong>{item.serviceNameEn}</strong>
                {item.serviceNameSi && (
                  <span className="admin-page__meta"> · {item.serviceNameSi}</span>
                )}
              </div>
              <button
                className={item.active ? 'btn btn--outline-red' : 'btn btn--green'}
                onClick={() => toggleActive(item)}
              >
                {item.active ? 'Deactivate' : 'Activate'}
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default ServiceCatalogAdminPage;