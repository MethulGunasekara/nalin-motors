import { useTranslation } from 'react-i18next';
import './LanguageSwitch.css';

const LanguageSwitch = () => {
  const { i18n } = useTranslation();

  const setLang = (lng) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('nalin_lang', lng);
  };

  return (
    <div className="lang-switch">
      <button
        className={i18n.language === 'en' ? 'active' : ''}
        onClick={() => setLang('en')}
      >
        EN
      </button>
      <button
        className={i18n.language === 'si' ? 'active' : ''}
        onClick={() => setLang('si')}
      >
        සිං
      </button>
    </div>
  );
};

export default LanguageSwitch;