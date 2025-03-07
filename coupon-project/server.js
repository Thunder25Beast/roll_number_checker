// server.js
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

// MySQL connection configuration
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Lak12',
  database: 'coupon_db'
});

connection.connect(err => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL database.');
});

// POST endpoint to add a roll number
app.post('/api/roll-numbers', (req, res) => {
  const { roll_number } = req.body;

  if (!roll_number) {
    return res.status(400).json({ message: 'Roll number is required.' });
  }

  const query = 'INSERT INTO roll_numbers (roll_number) VALUES (?)';
  connection.query(query, [roll_number], (err, results) => {
    if (err) {
      // Check for duplicate entry error
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(400).json({ message: 'Roll number already exists.' });
      }
      return res.status(500).json({ message: 'Database error.', error: err });
    }
    res.status(201).json({ message: 'Roll number added successfully.' });
  });
});

// GET endpoint to fetch roll numbers in ascending order
// GET endpoint to fetch roll numbers in ascending order (including id)
app.get('/api/roll-numbers', (req, res) => {
    const query = 'SELECT id, roll_number FROM roll_numbers ORDER BY roll_number ASC';
    connection.query(query, (err, results) => {
      if (err) {
        return res.status(500).json({ message: 'Database error.', error: err });
      }
      res.json(results);
    });
  });
  
// DELETE endpoint to remove a roll number
app.delete('/api/roll-numbers/:id', (req, res) => {
  const { id } = req.params;
  console.log('Deleting record with id:', id); // Debug log

  const query = 'DELETE FROM roll_numbers WHERE id = ?';
  connection.query(query, [id], (err, results) => {
    if (err) {
      console.error('Error executing DELETE query:', err);
      return res.status(500).json({ message: 'Database error.', error: err });
    }
    if (results.affectedRows === 0) {
      console.error('No roll number found with id:', id);
      return res.status(404).json({ message: 'Roll number not found.' });
    }
    res.json({ message: 'Roll number deleted successfully.' });
  });
});

  
// Start the server
app.listen(port, '0.0.0.0', () => {
    console.log(`Server running on port ${port}`);
  });