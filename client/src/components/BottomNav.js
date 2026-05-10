import React from 'react';

const navItems = [
  { key: 'home', label: 'Panel' },
  { key: 'fridge', label: 'Lodówka' },
  { key: 'scan', label: 'Skanuj' },
  { key: 'recipes', label: 'Przepisy' },
];

function BottomNav({ activePage, onChange }) {
  return (
    <nav className="bottom-nav">
      <div className="bottom-nav-inner">
        {navItems.map(item => (
          <button
            key={item.key}
            className={activePage === item.key ? 'nav-button active' : 'nav-button'}
            onClick={() => onChange(item.key)}
          >
            {item.label}
          </button>
        ))}
      </div>
    </nav>
  );
}

export default BottomNav;
