const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Connect to MySQL database
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'recipesDB',
});

db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err);
  } else {
    console.log('Connected to MySQL database');
  }
});

// Get all recipes
app.get('/recipes', (req, res) => {
  db.query('SELECT * FROM recipes', (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.json(results);
  });
});

// Search recipes by title
app.get('/recipes/searchByTitle', (req, res) => {
    const { title } = req.query;
    const searchQuery = `%${title}%`;
    db.query('SELECT * FROM recipes WHERE title LIKE ?', [searchQuery], (err, results) => {
      if (err) {
        return res.status(500).send(err);
      }
      res.json(results);
    });
  });
  
  // Search recipes by ingredients
  app.get('/recipes/searchByIngredients', (req, res) => {
    const { ingredients } = req.query;
    const searchQuery = `%${ingredients}%`;
    db.query('SELECT * FROM recipes WHERE ingredients LIKE ?', [searchQuery], (err, results) => {
      if (err) {
        return res.status(500).send(err);
      }
      res.json(results);
    });
  });
  

// Add a recipe
app.post('/recipes', (req, res) => {
  const { title, ingredients, instructions } = req.body;
  db.query(
    'INSERT INTO recipes (title, ingredients, instructions) VALUES (?, ?, ?)',
    [title, ingredients, instructions],
    (err, result) => {
      if (err) {
        return res.status(500).send(err);
      }
      res.json({ id: result.insertId, title, ingredients, instructions });
    }
  );
});

// Delete a recipe by ID
app.delete('/recipes/:id', (req, res) => {
    const { id } = req.params;
  
    db.query('DELETE FROM recipes WHERE id = ?', [id], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Failed to delete recipe' });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Recipe not found' });
      }
      res.json({ message: 'Recipe deleted successfully' });
    });
  });
  
// Start the server
app.listen(3001, () => {
  console.log('Backend server running at http://localhost:3001');
});
