import React, { useContext } from 'react';
import { FridgeContext } from '../context/FridgeContext';

function getExpiryLabel(expiryDate) {
  const today = new Date();
  const date = new Date(expiryDate);
  const diffDays = Math.ceil((date - today) / (1000 * 60 * 60 * 24));

  if (diffDays <= 0) return 'Dziś';
  if (diffDays === 1) return 'Jutro';
  return `${diffDays} dni`;
}

function HomePage({ onNavigate }) {
  const { fridgeItems } = useContext(FridgeContext);
  const soonestItems = fridgeItems
    .filter(item => item.expiryDate)
    .sort((a, b) => new Date(a.expiryDate) - new Date(b.expiryDate))
    .slice(0, 3);

  return (
    <>
      <div className="hero-panel">
        <div>
          <p className="small-label">Witaj, Anna!</p>
          <h1>Twój ekosystem kwitnie.</h1>
          <p className="hero-subtitle">Zrównoważone zarządzanie domem.</p>
        </div>

        <div>
          <div className="summary-card">
            <span>Stan lodówki</span>
            <strong>{fridgeItems.length}</strong>
            <span>produkty</span>
          </div>
          <div className="hero-actions">
            <button className="secondary-button" onClick={() => onNavigate('scan')}>
              Dodaj produkt
            </button>
          </div>
        </div>
      </div>

      <section className="expiring-section">
        <div className="section-header">
          <div>
            <h2>Kończący się termin</h2>
          </div>
          <button className="link-button" onClick={() => onNavigate('fridge')}>
            Zobacz wszystko
          </button>
        </div>

        <div className="expiring-grid">
          {soonestItems.length === 0 ? (
            <div className="empty-card">Brak produktów do wyświetlenia. Dodaj coś do lodówki.</div>
          ) : soonestItems.map(item => (
            <div key={item.id} className="expiring-card">
              <div className="expiring-details">
                <div className="expiring-icon">🥬</div>
                <div>
                  <h3>{item.name}</h3>
                  <p>{item.category || 'Inne'}</p>
                </div>
              </div>
              <span className={`expiry-pill ${getExpiryLabel(item.expiryDate) === 'Dziś' ? 'expiry-today' : 'expiry-soon'}`}>
                {getExpiryLabel(item.expiryDate)}
              </span>
            </div>
          ))}
        </div>
      </section>

      <div className="primary-action-row">
        <button className="primary-button" onClick={() => onNavigate('scan')}>
          + Dodaj produkt
        </button>
      </div>
    </>
  );
}

export default HomePage;
