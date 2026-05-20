import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';

function RegisterPage({ onSwitchToLogin }) {
  const { register } = useContext(AuthContext);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Hasła muszą być identyczne.');
      return;
    }

    setIsSubmitting(true);
    try {
      await register({ name: name.trim(), email: email.trim(), password });
    } catch (err) {
      setError(err.message || 'Nie udało się utworzyć konta.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-screen">
      <div className="auth-card">
        <p className="small-label">Dołącz do nas</p>
        <h1 className="auth-title">Załóż konto</h1>
        <p className="auth-subtitle">
          Stwórz konto, aby zapisywać produkty, przepisy i listę zakupów w jednym miejscu.
        </p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label className="auth-field">
            <span>Imię</span>
            <input
              type="text"
              autoComplete="given-name"
              placeholder="Anna"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </label>

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
              autoComplete="new-password"
              placeholder="Min. 6 znaków"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>

          <label className="auth-field">
            <span>Powtórz hasło</span>
            <input
              type="password"
              autoComplete="new-password"
              placeholder="Powtórz hasło"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </label>

          {error && <div className="auth-error">{error}</div>}

          <button type="submit" className="primary-button auth-submit" disabled={isSubmitting}>
            {isSubmitting ? 'Tworzenie konta…' : 'Załóż konto'}
          </button>
        </form>

        <p className="auth-switch">
          Masz już konto?{' '}
          <button type="button" className="link-button" onClick={onSwitchToLogin}>
            Zaloguj się
          </button>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;
