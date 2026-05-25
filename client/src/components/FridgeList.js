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
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState('newest');

  const normalizedQuery = normalizeText(searchQuery.trim());
  const visibleItems = fridgeItems
    .filter((item) => normalizeText(item.name || '').includes(normalizedQuery))
    .sort((firstItem, secondItem) => {
      const firstTimestamp = getDateAddedTimestamp(firstItem.dateAdded);
      const secondTimestamp = getDateAddedTimestamp(secondItem.dateAdded);

      return sortOrder === 'oldest'
        ? firstTimestamp - secondTimestamp
        : secondTimestamp - firstTimestamp;
    });

  const resultsLabel = searchQuery.trim()
    ? `${visibleItems.length} z ${fridgeItems.length} produkt\u00f3w`
    : `${fridgeItems.length} produkt\u00f3w`;

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
<<<<<<< HEAD
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
=======
          {visibleItems.map((item) => (
            <div key={item.id} className="item-card">
              <div className="item-top-row">
                <span className="item-name">{item.name}</span>
                <span className="item-category-badge">{item.category || 'Inne'}</span>
              </div>

              <div className="item-detail">
                <span className="item-label">{'Ilo\u015b\u0107'}</span>
                <strong>{item.quantity} {item.unit}</strong>
              </div>

              <div className="item-detail">
                <span className="item-label">{'Wa\u017cne do'}</span>
                <strong className={new Date(item.expiryDate) < new Date() ? 'expired' : ''}>
                  {item.expiryDate || 'Brak daty'}
                </strong>
              </div>

              <div className="item-detail">
                <span className="item-label">Dodano</span>
                <strong>{formatDateAdded(item.dateAdded)}</strong>
              </div>

              <div className="item-actions">
                <button className="btn-edit" onClick={() => onEdit(item)}>Edytuj</button>
                <button className="btn-delete" onClick={() => removeItem(item.id)}>{'Usu\u0144'}</button>
>>>>>>> upstream/main
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default FridgeList;