import React, { useState, useContext, useEffect } from 'react';
import { FridgeContext } from '../context/FridgeContext';
import './FridgeManager.css';

const initialState = { name: '', quantity: '', unit: 'szt.', category: 'Inne', expiryDate: '', barcode: '' };

function ProductForm({ editingProduct, setEditingProduct, presetProduct }) {
  const { addItem, updateItem } = useContext(FridgeContext);
  const [product, setProduct] = useState(initialState);
  const [errors, setErrors] = useState({});
  const categories = ['Nabiał', 'Warzywa', 'Owoce', 'Mięso', 'Pieczywo', 'Płatki', 'Napoje', 'Inne'];
  const units = ['szt.', 'g', 'kg', 'ml', 'l', 'pęczek', 'opak.'];

  useEffect(() => {
    if (editingProduct) {
      setProduct(editingProduct);
      setErrors({});
    } else if (presetProduct) {
      setProduct({ ...initialState, ...presetProduct });
      setErrors({});
    } else {
      setProduct(initialState);
    }
  }, [editingProduct, presetProduct]);

  const validate = (name, value) => {
    let error = '';

    if (name === 'name') {
      const specialCharsRegex = /^[a-zA-Z0-9ąęćłńóśźżĄĘĆŁŃÓŚŹŻ ]*$/;
      if (value.trim().length > 0 && value.trim().length < 3) {
        error = 'Nazwa musi mieć min. 3 znaki';
      } else if (!specialCharsRegex.test(value)) {
        error = 'Znaki specjalne są niedozwolone';
      }
    }

    if (name === 'quantity') {
      if (parseFloat(value) <= 0 || isNaN(value)) {
        error = 'Ilość musi być większa od 0';
      }
    }

    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct(prev => ({ ...prev, [name]: value }));
    validate(name, value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const specialCharsRegex = /^[a-zA-Z0-9ąęćłńóśźżĄĘĆŁŃÓŚŹŻ ]*$/;
    const isNameValid = product.name.trim().length >= 3 && specialCharsRegex.test(product.name);
    const isQuantityValid = parseFloat(product.quantity) > 0;

    if (isNameValid && isQuantityValid) {
      if (editingProduct) {
        updateItem(editingProduct.id, product);
        setEditingProduct(null);
      } else {
        addItem(product);
      }
      setProduct(initialState);
      setErrors({});
    }
  };

  return (
    <div className="product-form">
      <h3>{editingProduct ? 'Edytuj produkt' : 'Dodaj produkt'}</h3>
      <form onSubmit={handleSubmit} className="form-group">
        <div className="input-field-container">
          <input
            name="name"
            type="text"
            placeholder="Nazwa (np. Pomidor)"
            value={product.name}
            onChange={handleChange}
            className={errors.name ? 'input-error' : ''}
          />
          {errors.name && <span className="error-text">{errors.name}</span>}
        </div>

        <div className="input-field-container">
          <select name="category" value={product.category} onChange={handleChange}>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div className="input-row">
          <div className="input-field-container flex-2">
            <input
              name="quantity"
              type="number"
              placeholder="Ilość"
              value={product.quantity}
              onChange={handleChange}
              className={errors.quantity ? 'input-error' : ''}
            />
            {errors.quantity && <span className="error-text">{errors.quantity}</span>}
          </div>

          <div className="input-field-container flex-1">
            <select name="unit" value={product.unit} onChange={handleChange}>
              {units.map(unit => (
                <option key={unit} value={unit}>{unit}</option>
              ))}
            </select>
          </div>
        </div>


        <div className="input-field-container">
          <label className="input-label">Data ważności:</label>
          <input
            type="date"
            name="expiryDate"
            value={product.expiryDate}
            onChange={handleChange}
            className={errors.expiryDate ? 'input-error' : ''}
          />
          {errors.expiryDate && <span className="error-text">{errors.expiryDate}</span>}
        </div>

        <button
          type="submit"
          className="btn-add"
          disabled={Object.values(errors).some(e => e !== '') || !product.name || !product.quantity}
        >
          {editingProduct ? 'Zapisz zmiany' : 'Dodaj do lodówki'}
        </button>

        {editingProduct && (
          <button type="button" className="btn-cancel" onClick={() => { setEditingProduct(null); setProduct(initialState); }}>
            Anuluj edycję
          </button>
        )}
      </form>
    </div>
  );
}

export default ProductForm;
