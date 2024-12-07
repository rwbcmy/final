import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [recipes, setRecipes] = useState([]);
  const [searchName, setSearchName] = useState('');
  const [searchIngredients, setSearchIngredients] = useState('');
  const [newRecipe, setNewRecipe] = useState({ title: '', ingredients: '', instructions: '' });

  const fetchRecipes = async () => {
    const response = await axios.get('http://localhost:3001/recipes');
    setRecipes(response.data);
  };

  const searchByName = async () => {
    try {
      const response = await axios.get('http://localhost:3001/recipes/searchByTitle', {
        params: { title: searchName },
      });
      setRecipes(response.data);
    } catch (error) {
      console.error('Error searching recipes by name:', error);
    }
  };

  const searchByIngredients = async () => {
    try {
      const response = await axios.get('http://localhost:3001/recipes/searchByIngredients', {
        params: { ingredients: searchIngredients },
      });
      setRecipes(response.data);
    } catch (error) {
      console.error('Error searching recipes by ingredients:', error);
    }
  };

  const addRecipe = async () => {
    await axios.post('http://localhost:3001/recipes', newRecipe);
    fetchRecipes();
    setNewRecipe({ title: '', ingredients: '', instructions: '' });
  };

  const deleteRecipe = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/recipes/${id}`);
      setRecipes((prevRecipes) => prevRecipes.filter((recipe) => recipe.id !== id));
      alert('Recipe deleted successfully');
    } catch (error) {
      console.error('Error deleting recipe:', error);
      alert('Failed to delete recipe');
    }
  };

  useEffect(() => {
    fetchRecipes();
  }, []);

  return (
    <div className="container">
      <h1>Recipe Sharing App</h1>

      {/* Search Section */}
      <div className="section">
        <h2>Search by Name</h2>
        <input
          type="text"
          placeholder="Enter recipe name"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
        />
        <button onClick={searchByName}>Search</button>
      </div>

      <div className="section">
        <h2>Search by Ingredients</h2>
        <input
          type="text"
          placeholder="Enter ingredients"
          value={searchIngredients}
          onChange={(e) => setSearchIngredients(e.target.value)}
        />
        <button onClick={searchByIngredients}>Search</button>
      </div>

      {/* Add New Recipe Section */}
      <div className="section">
        <h2>Add New Recipe</h2>
        <input
          type="text"
          placeholder="Title"
          value={newRecipe.title}
          onChange={(e) => setNewRecipe({ ...newRecipe, title: e.target.value })}
        />
        <textarea
          placeholder="Ingredients"
          value={newRecipe.ingredients}
          onChange={(e) => setNewRecipe({ ...newRecipe, ingredients: e.target.value })}
        />
        <textarea
          placeholder="Instructions"
          value={newRecipe.instructions}
          onChange={(e) => setNewRecipe({ ...newRecipe, instructions: e.target.value })}
        />
        <button onClick={addRecipe}>Add Recipe</button>
      </div>

      {/* Recipes List */}
      <div className="section">
        <h2>Recipes</h2>
        {recipes.map((recipe) => (
          <div key={recipe.id} className="recipe">
            <h3>{recipe.title}</h3>
            <p><strong>Ingredients:</strong> {recipe.ingredients}</p>
            <p><strong>Instructions:</strong> {recipe.instructions}</p>
            <button onClick={() => deleteRecipe(recipe.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
