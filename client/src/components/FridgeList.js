import React, { useContext } from 'react';
import { FridgeContext } from '../context/FridgeContext';
import './FridgeManager.css';

function FridgeList({ onEdit }) {
  const { fridgeItems, removeItem } = useContext(FridgeContext);

  return (
    <div className="fridge-list">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h3 style={{ color: '#166534', margin: 0 }}>Twoja Lodówka</h3>
        <span style={{ fontSize: '0.85rem', color: '#64748b', background: '#f1f5f9', padding: '4px 12px', borderRadius: '20px', fontWeight: '600' }}>
          {fridgeItems.length} produktów
        </span>
      </div>

      {fridgeItems.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#94a3b8', background: '#f8fafc', borderRadius: '12px', border: '2px dashed #e2e8f0' }}>
          <p>Twoja lodówka jest pusta. Dodaj produkty, aby system FoodWise mógł zaproponować przepisy![cite: 1]</p>
        </div>
      ) : (
        <div className="items-grid">
          {fridgeItems.map(item => {
            return (
              <div key={item.id} className="item-card" style={{ backgroundColor: '#ffffff' }}> 
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <span className="item-name" style={{ color: '#1e293b', fontWeight: '700' }}>{item.name}</span>
                  {/* Neutralna etykieta kategorii */}
                  <span style={{ 
                    fontSize: '10px', 
                    fontWeight: '800', 
                    color: '#64748b',
                    backgroundColor: '#f1f5f9',
                    padding: '3px 8px',
                    borderRadius: '6px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    {item.category || 'Inne'}
                  </span>
                </div>
                
                <div style={{ color: '#64748b', fontSize: '14px', marginBottom: '0px' }}>
                  Ilość: <strong>{item.quantity} {item.unit}</strong>
                </div>

                <div style={{ fontSize: '14px', marginTop: '5px', marginBottom: '5px' }}>
                  <span style={{ color: '#64748b' }}>Ważne do: </span>
                  <span style={{ 
                    fontWeight: '600', 
                    color: new Date(item.expiryDate) < new Date() ? '#ef4444' : '#1e293b' 
                  }}>
                    {item.expiryDate || 'Brak daty'}
                  </span>
                </div>

                <div className="actions" style={{ display: 'flex', gap: '8px', marginTop: 'auto' }}>
                  <button 
                    className="btn-edit" 
                    onClick={() => onEdit(item)}
                    style={{ flex: 1, padding: '8px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}
                  >
                    Edytuj
                  </button>
                  <button 
                    className="btn-delete" 
                    onClick={() => removeItem(item.id)}
                    style={{ flex: 1, padding: '8px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}
                  >
                    Usuń
                  </button>
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