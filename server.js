const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// This is your secret vault key
const pool = new Pool({
  connectionString: 'PASTE_YOUR_URL_HERE',
  ssl: { rejectUnauthorized: false }
});

// This part saves the comment to the database
app.post('/comments', async (req, res) => {
  try {
    const { username, content } = req.body;
    await pool.query('INSERT INTO comments (username, content) VALUES ($1, $2)', [username, content]);
    res.json({ message: 'Comment saved!' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Database error');
  }
});

// This part gets all comments to show on your site
app.get('/comments', async (req, res) => {
  const result = await pool.query('SELECT * FROM comments ORDER BY created_at DESC');
  res.json(result.rows);
});

app.listen(3000, () => console.log('Server is running on http://localhost:3000'));