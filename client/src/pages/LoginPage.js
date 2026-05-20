import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';

function LoginPage({ onSwitchToRegister }) {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      await login({ email: email.trim(), password });
    } catch (err) {
      setError(err.message || 'Nie udało się zalogować.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-screen">
      <div className="auth-card">
        <p className="small-label">Witaj ponownie</p>
        <h1 className="auth-title">Zaloguj się</h1>
        <p className="auth-subtitle">
          Zarządzaj swoją lodówką, planuj zakupy i ograniczaj marnowanie żywności.
        </p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label className="auth-field">
            <span>E-mail</span>
            <input
              type="email"
              autoComplete="email"
              placeholder="ty@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>

          <label className="auth-field">
            <span>Hasło</span>
            <input
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>

          {error && <div className="auth-error">{error}</div>}

          <button type="submit" className="primary-button auth-submit" disabled={isSubmitting}>
            {isSubmitting ? 'Logowanie…' : 'Zaloguj się'}
          </button>
        </form>

        <p className="auth-switch">
          Nie masz konta?{' '}
          <button type="button" className="link-button" onClick={onSwitchToRegister}>
            Zarejestruj się
          </button>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
