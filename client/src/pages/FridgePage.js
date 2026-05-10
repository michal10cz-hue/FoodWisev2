import React from 'react';
import FridgeList from '../components/FridgeList';

function FridgePage({ onEdit }) {
  return (
    <div className="page-card">
      <div className="section-header">
        <div>
          <h2>Lodówka</h2>
          <p className="hero-subtitle">Sprawdź swoje produkty i zarządzaj nimi.</p>
        </div>
      </div>
      <FridgeList onEdit={onEdit} />
    </div>
  );
}

export default FridgePage;
