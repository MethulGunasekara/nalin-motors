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
      {/* Decorative background panel */}
      <div className="login-page__bg-panel">
        <div className="login-page__bg-circles">
          <span className="circle circle--1" />
          <span className="circle circle--2" />
          <span className="circle circle--3" />
        </div>
        <div className="login-page__brand-block">
          <img src={logo} alt="Nalin Motors" className="login-page__brand-logo" />
          <h1 className="login-page__brand-name">Nalin Motors</h1>
          <p className="login-page__brand-tagline">Bike Service Management</p>
        </div>
      </div>

      {/* Form panel */}
      <div className="login-page__form-panel">
        <div className="login-page__lang">
          <LanguageSwitch />
        </div>

        <div className="login-card">
          <div className="login-card__icon">🔧</div>
          <h2 className="login-card__title">{t('login.title')}</h2>
          <p className="login-card__subtitle">Sign in to continue to your dashboard</p>

          <form onSubmit={handleSubmit}>
            <div className="login-field">
              <label className="login-field__label">{t('login.phone')}</label>
              <div className="login-field__input-wrap">
                <span className="login-field__icon">📱</span>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="07X XXX XXXX"
                  required
                />
              </div>
            </div>

            <div className="login-field">
              <label className="login-field__label">{t('login.password')}</label>
              <div className="login-field__input-wrap">
                <span className="login-field__icon">🔒</span>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="login-card__error">
                <span>⚠️</span> {error}
              </div>
            )}

            <button type="submit" className="login-card__btn" disabled={loading}>
              {loading ? (
                <span className="login-card__btn-loading">
                  <span className="spinner" /> Signing in...
                </span>
              ) : (
                t('login.submit')
              )}
            </button>
          </form>
        </div>

        <p className="login-page__footer">
          Nalin Motors · Internal Staff Portal
        </p>
      </div>
    </div>
  );
};

export default LoginPage;