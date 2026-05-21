import React, { useContext, useEffect } from 'react';
import { FridgeContext } from '../context/FridgeContext';
import FridgeList from '../components/FridgeList';

function FridgePage({ onEdit }) {
  const { showNotificationIfNeeded } = useContext(FridgeContext);

  // Powiadomienie pojawi się TYLKO przy wejściu na stronę Lodówki
  useEffect(() => {
    showNotificationIfNeeded();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Pusta tablica = tylko raz przy montowaniu komponentu

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