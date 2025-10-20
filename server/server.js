// server.js

const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
app.use(cors()); // Allow requests from other domains (like your Vue app)
app.use(express.json()); // Allow the server to read JSON from requests
const port = 3000;

// Configure the connection to your PostgreSQL database
const pool = new Pool({
  user: 'your_db_user',
  host: 'localhost',
  database: 'your_whiteboard_db', // Use the same DB name as in the SQL file
  password: 'your_db_password',
  port: 5432,
});

// --- API Endpoints ---

// GET endpoint: Fetches all ideas from the database
app.get('/api/ideas', async (req, res) => {
  try {
    // This query joins the ideas table with the users table ON THE LOCKED_BY_ID.
    // This way, we get the username of the person who locked it, but not the original author.
    const query = `
      SELECT
        ideas.id,
        ideas.content,
        ideas.is_locked,
        ideas.created_at,
        users.username AS locked_by_username
      FROM ideas
      LEFT JOIN users ON ideas.locked_by_id = users.id
      ORDER BY ideas.created_at DESC;
    `;
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// POST endpoint: Adds a new idea to the database
app.post('/api/ideas', async (req, res) => {
  try {
    // In a real app, you would get userId from a session or token
    const { content, userId } = req.body; 
    if (!content || !userId) {
      return res.status(400).json({ error: 'Content and userId are required' });
    }
    const newIdea = await pool.query(
      'INSERT INTO ideas (content, user_id) VALUES ($1, $2) RETURNING *',
      [content, userId]
    );
    // Don't send the user_id back to the front-end to maintain anonymity
    const result = { ...newIdea.rows[0], user_id: undefined };
    res.status(201).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// POST endpoint: Locks an idea for a user
app.post('/api/ideas/:id/lock', async (req, res) => {
    const { id } = req.params; // The ID of the idea to lock
    const { userId } = req.body; // The ID of the user who is locking it

    if (!userId) {
        return res.status(401).json({ error: 'Authentication required' });
    }

    try {
        // First, check if the idea is already locked
        const ideaResult = await pool.query('SELECT * FROM ideas WHERE id = $1', [id]);
        if (ideaResult.rows.length === 0) {
            return res.status(404).json({ error: 'Idea not found' });
        }
        if (ideaResult.rows[0].is_locked) {
            return res.status(409).json({ error: 'This idea is already locked' });
        }

        // If not locked, update it
        const updatedIdea = await pool.query(
            'UPDATE ideas SET is_locked = TRUE, locked_by_id = $1 WHERE id = $2 RETURNING *',
            [userId, id]
        );
        res.json(updatedIdea.rows[0]);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Something went wrong' });
    }
});


// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});