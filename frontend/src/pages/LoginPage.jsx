import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import axiosClient from '../api/axiosClient';
import LanguageSwitch from '../components/LanguageSwitch';
import logo from '../assets/logo.png';
import './LoginPage.css';

const LoginPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await axiosClient.post('/auth/login', { phone, password });
      localStorage.setItem('nalin_token', data.token);
      localStorage.setItem('nalin_employee', JSON.stringify(data));
      navigate('/');
    } catch (err) {
      setError(t('login.error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-page__lang">
        <LanguageSwitch />
      </div>
      <div className="login-card">
        <img src={logo} alt="Nalin Motors" className="login-card__logo" />
        <h1>{t('login.title')}</h1>
        <form onSubmit={handleSubmit}>
          <label>{t('login.phone')}</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
          <label>{t('login.password')}</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && <p className="login-card__error">{error}</p>}
          <button type="submit" disabled={loading}>
            {loading ? '...' : t('login.submit')}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;