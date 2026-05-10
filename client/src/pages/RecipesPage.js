import React from 'react';
import RecipeRecommendations from '../components/RecipeRecommendations';

function RecipesPage() {
  return (
    <div className="page-card">
      <div className="section-header">
        <div>
          <h2>Przepisy</h2>
          <p className="hero-subtitle">Rekomendacje na podstawie zawartości lodówki.</p>
        </div>
      </div>
      <RecipeRecommendations />
    </div>
  );
}

export default RecipesPage;
