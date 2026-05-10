import React, { useState } from 'react';
import ProductForm from '../components/ProductForm';

const barcodeLookup = {
  '5901234123457': { name: 'Mleko 1L', category: 'Nabiał', quantity: 1, unit: 'l', expiryDate: '' },
  '5909876543210': { name: 'Chleb pełnoziarnisty', category: 'Pieczywo', quantity: 1, unit: 'szt.', expiryDate: '' },
  '1234567890123': { name: 'Jabłka', category: 'Owoce', quantity: 4, unit: 'szt.', expiryDate: '' },
};

function ScanPage({ editingProduct, setEditingProduct }) {
  const [barcode, setBarcode] = useState('');
  const [prefillProduct, setPrefillProduct] = useState(null);

  const handleBarcodeChange = (e) => {
    const code = e.target.value;
    setBarcode(code);
    const normalized = code.replace(/\s+/g, '');

    if (!normalized) {
      setPrefillProduct(null);
      return;
    }

    const lookup = barcodeLookup[normalized];
    setPrefillProduct({ barcode: normalized, ...(lookup || {}) });
  };

  return (
    <div className="page-card">
      <div className="section-header">
        <div>
          <h2>Skanuj produkt</h2>
          <p className="hero-subtitle">Dodaj produkt ręcznie lub zeskanuj jego kod.</p>
        </div>
      </div>
      <div className="scan-panel">
        <div className="scan-info-card">
          <p className="small-label">Skanuj kod kreskowy</p>
          <div className="scanner-placeholder">📷</div>
          <div className="barcode-field">
            <label className="input-label">Wpisz kod kreskowy</label>
            <input
              type="text"
              value={barcode}
              onChange={handleBarcodeChange}
              placeholder="0000000000000"
            />
            <p className="scan-hint">
              {prefillProduct && prefillProduct.name
                ? 'Dane produktu uzupełnione automatycznie. Możesz je edytować poniżej.'
                : 'Wpisz kod, by spróbować automatycznie uzupełnić dane produktu.'}
            </p>
          </div>
        </div>
        <ProductForm
          editingProduct={editingProduct}
          setEditingProduct={setEditingProduct}
          presetProduct={prefillProduct}
        />
      </div>
    </div>
  );
}

export default ScanPage;
