import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './AdminNav.css';

const AdminNav = () => {
  const { t } = useTranslation();

  return (
    <nav className="admin-nav">
      <NavLink to="/" end className={({ isActive }) => (isActive ? 'active' : '')}>
        {t('nav.dashboard')}
      </NavLink>
      <NavLink to="/admin/employees" className={({ isActive }) => (isActive ? 'active' : '')}>
        {t('nav.employees')}
      </NavLink>
      <NavLink to="/admin/catalog" className={({ isActive }) => (isActive ? 'active' : '')}>
        {t('nav.catalog')}
      </NavLink>
    </nav>
  );
};

export default AdminNav;