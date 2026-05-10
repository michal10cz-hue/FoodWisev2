import React, { useContext } from 'react';
import { FridgeContext } from '../context/FridgeContext';
import './RecipeRecommendations.css';

const sampleRecipes = [
  {
    id: 1,
    name: 'Jajecznica',
    ingredients: ['jajka', 'masło', 'szczypiorek'],
    description: 'Klasyczna jajecznica na maśle',
  },
  {
    id: 2,
    name: 'Sałatka warzywna',
    ingredients: ['marchewka', 'cebula', 'ogórek', 'pomidor'],
    description: 'Świeża sałatka sezonowa',
  },
  {
    id: 3,
    name: 'Kanapki z warzywami',
    ingredients: ['chleb', 'masło', 'pomidor', 'ogórek', 'sałata'],
    description: 'Proste kanapki na drugie śniadanie',
  },
  {
    id: 4,
    name: 'Omlet z warzywami',
    ingredients: ['jajka', 'cebula', 'pomidor', 'papryka'],
    description: 'Omlet z dowolnymi warzywami',
  },
  {
    id: 5,
    name: 'Zupa warzywna',
    ingredients: ['marchewka', 'cebula', 'ziemniaki', 'kapusta'],
    description: 'Domowa zupa z warzyw',
  },
];

function RecipeRecommendations() {
  const { fridgeItems } = useContext(FridgeContext);

  const getMatchingRecipes = () => {
    const fridgeIngredients = fridgeItems.map(item => 
      item.name.toLowerCase()
    );

    return sampleRecipes.filter(recipe => {
      const matchCount = recipe.ingredients.filter(ing =>
        fridgeIngredients.some(fridgeIng => 
          fridgeIng.includes(ing) || ing.includes(fridgeIng)
        )
      ).length;
      return matchCount > 0;
    }).sort((a, b) => {
      const aMatches = a.ingredients.filter(ing =>
        fridgeIngredients.some(fridgeIng => 
          fridgeIng.includes(ing) || ing.includes(fridgeIng)
        )).length;
      const bMatches = b.ingredients.filter(ing =>
        fridgeIngredients.some(fridgeIng => 
          fridgeIng.includes(ing) || ing.includes(fridgeIng)
        )).length;
      return bMatches - aMatches;
    });
  };

  const matchingRecipes = getMatchingRecipes();

  return (
    <div className="recipe-recommendations">
      <h2>Rekomendowane przepisy</h2>
      <p className="subtitle">Na podstawie zawartości Twojej lodówki</p>
      
      {fridgeItems.length === 0 ? (
        <div className="empty-fridge">
          <p>Dodaj produkty do lodówki, aby otrzymać rekomendacje</p>
        </div>
      ) : matchingRecipes.length === 0 ? (
        <div className="no-matches">
          <p>Brak pasujących przepisów. Dodaj więcej produktów do lodówki!</p>
        </div>
      ) : (
        <div className="recipes-grid">
          {matchingRecipes.map(recipe => (
            <div key={recipe.id} className="recipe-card">
              <h3>{recipe.name}</h3>
              <p className="recipe-description">{recipe.description}</p>
              <div className="recipe-ingredients">
                <strong>Składniki:</strong>
                <ul>
                  {recipe.ingredients.map((ing, index) => (
                    <li key={index} className={
                      fridgeItems.some(item => 
                        item.name.toLowerCase().includes(ing)
                      ) ? 'available' : 'missing'
                    }>
                      {ing}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default RecipeRecommendations;