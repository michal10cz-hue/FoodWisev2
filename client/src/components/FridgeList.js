import React, { useContext, useState } from 'react';
import { FridgeContext } from '../context/FridgeContext';
import './FridgeManager.css';

function normalizeText(value) {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\u0142/g, 'l');
}

function getDateAddedTimestamp(dateAdded) {
  const parsedDate = new Date(dateAdded);
  const timestamp = parsedDate.getTime();

  return Number.isNaN(timestamp) ? 0 : timestamp;
}

function formatDateAdded(dateAdded) {
  if (!dateAdded) {
    return 'Brak daty';
  }

  const parsedDate = new Date(dateAdded);

  if (Number.isNaN(parsedDate.getTime())) {
    return 'Brak daty';
  }

  return new Intl.DateTimeFormat('pl-PL', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(parsedDate);
}

function FridgeList({ onEdit }) {
  const { fridgeItems, removeItem } = useContext(FridgeContext);

  return (
    <div className="fridge-list">
      <div className="fridge-list-header">
        <h3>{'Twoja Lod\u00f3wka'}</h3>
        <span className="fridge-count-badge">{resultsLabel}</span>
      </div>

      {fridgeItems.length > 0 && (
        <div className="fridge-list-controls">
          <label className="fridge-control-field">
            <span>Wyszukaj po nazwie</span>
            <input
              type="search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="np. mleko"
            />
          </label>

          <label className="fridge-control-field">
            <span>Sortuj po dacie dodania</span>
            <select value={sortOrder} onChange={(event) => setSortOrder(event.target.value)}>
              <option value="newest">Najnowsze</option>
              <option value="oldest">Najstarsze</option>
            </select>
          </label>
        </div>
      )}

      {fridgeItems.length === 0 ? (
        <div className="empty-fridge-state">
          <p>{'Twoja lod\u00f3wka jest pusta. Dodaj produkty, aby system FoodWise m\u00f3g\u0142 zaproponowa\u0107 przepisy.'}</p>
        </div>
      ) : visibleItems.length === 0 ? (
        <div className="empty-fridge-state">
          <p>{'Brak produkt\u00f3w pasuj\u0105cych do wyszukiwania. Spr\u00f3buj innej nazwy.'}</p>
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