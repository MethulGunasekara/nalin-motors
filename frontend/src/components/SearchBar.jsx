import { useTranslation } from 'react-i18next';
import './SearchBar.css';

const SearchBar = ({ value, onChange }) => {
  const { t } = useTranslation();

  return (
    <div className="search-bar">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={t('dashboard.searchPlaceholder')}
      />
      {value && (
        <button className="search-bar__clear" onClick={() => onChange('')} aria-label="Clear search">
          ×
        </button>
      )}
    </div>
  );
};

export default SearchBar;