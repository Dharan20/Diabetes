const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE
});

app.post('/api/readings', async (req, res) => {
  try {
    const { userId, glucoseLevel, notes } = req.body;
    const [result] = await pool.execute(
      'INSERT INTO readings (user_id, glucose_level, timestamp, notes) VALUES (?, ?, NOW(), ?)',
      [userId, glucoseLevel, notes]
    );
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to save reading' });
  }
});

app.get('/api/readings', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM readings');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch readings' });
  }
});

app.listen(5000, () => {
  console.log('Server running on port 5000');
});