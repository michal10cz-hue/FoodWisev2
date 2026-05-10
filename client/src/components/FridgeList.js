import React, { useContext } from 'react';
import { FridgeContext } from '../context/FridgeContext';
import './FridgeManager.css';

function FridgeList({ onEdit }) {
  const { fridgeItems, removeItem } = useContext(FridgeContext);

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
          {fridgeItems.map(item => (
            <div key={item.id} className="item-card">
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
                <strong className={new Date(item.expiryDate) < new Date() ? 'expired' : ''}>
                  {item.expiryDate || 'Brak daty'}
                </strong>
              </div>

              <div className="item-actions">
                <button className="btn-edit" onClick={() => onEdit(item)}>Edytuj</button>
                <button className="btn-delete" onClick={() => removeItem(item.id)}>Usuń</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default FridgeList;
