import React, { useContext } from 'react';
import { FridgeContext } from '../context/FridgeContext';
import './FridgeManager.css';

function FridgeList({ onEdit }) {
  const { fridgeItems, removeItem } = useContext(FridgeContext);

  // Funkcja określająca status produktu na podstawie daty
  const getExpiryStatus = (expiryDate) => {
    if (!expiryDate) return 'no-date';
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const expiry = new Date(expiryDate);
    expiry.setHours(0, 0, 0, 0);
    const daysLeft = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
    
    if (daysLeft < 0) return 'expired';
    if (daysLeft <= 3) return 'expiring-soon';
    if (daysLeft <= 7) return 'expiring-week';
    return 'fresh';
  };

  // Funkcja formatująca tekst ostrzeżenia
  const getExpiryText = (expiryDate) => {
    if (!expiryDate) return 'Brak daty';
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const expiry = new Date(expiryDate);
    expiry.setHours(0, 0, 0, 0);
    const daysLeft = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
    
    if (daysLeft < 0) return 'PRZETERMINOWANY!';
    if (daysLeft === 0) return 'WAŻNY TYLKO DZIŚ!';
    if (daysLeft === 1) return 'Ważny do jutra!';
    if (daysLeft <= 3) return `Ważny jeszcze ${daysLeft} dni`;
    return expiryDate;
  };

  return (
    <div className="fridge-list">
      <div className="fridge-list-header">
        <h3>Twoja Lodówka</h3>
        <span className="fridge-count-badge">{fridgeItems.length} produktów</span>
      </div>

      {fridgeItems.length === 0 ? (
        <div className="empty-fridge-state">
          <p>Twoja lodówka jest pusta. Dodaj produkty, aby system FoodWise mógł zaproponować przepisy.</p>
        </div>
      ) : (
        <div className="items-grid">
          {fridgeItems.map(item => {
            const status = getExpiryStatus(item.expiryDate);
            return (
              <div key={item.id} className={`item-card ${status}`}>
                <div className="item-top-row">
                  <span className="item-name">{item.name}</span>
                  <span className="item-category-badge">{item.category || 'Inne'}</span>
                </div>

                <div className="item-detail">
                  <span className="item-label">Ilość</span>
                  <strong>{item.quantity} {item.unit}</strong>
                </div>

                <div className="item-detail">
                  <span className="item-label">Ważne do</span>
                  <strong className={status === 'expired' ? 'expired-text' : status === 'expiring-soon' ? 'expiring-soon-text' : ''}>
                    {getExpiryText(item.expiryDate)}
                  </strong>
                </div>

                <div className="item-actions">
                  <button className="btn-edit" onClick={() => onEdit(item)}>Edytuj</button>
                  <button className="btn-delete" onClick={() => removeItem(item.id)}>Usuń</button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default FridgeList;