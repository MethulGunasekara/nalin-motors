import { useTranslation } from 'react-i18next';
import LanguageSwitch from './LanguageSwitch';
import logo from '../assets/logo.png';
import './Header.css';

const Header = ({ employeeName, onLogout }) => {
  const { t } = useTranslation();

  return (
    <header className="app-header">
      <div className="app-header__brand">
        <img src={logo} alt="Nalin Motors" className="app-header__logo" />
        <span className="app-header__title">{t('app.name')}</span>
      </div>
      <div className="app-header__actions">
        <LanguageSwitch />
        {employeeName && (
          <>
            <span className="app-header__user">{employeeName}</span>
            <button className="app-header__logout" onClick={onLogout}>
              {t('nav.logout')}
            </button>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;