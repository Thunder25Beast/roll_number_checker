// src/App.js
import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [rollNumber, setRollNumber] = useState('');
  const [rollNumbers, setRollNumbers] = useState([]);
  const [message, setMessage] = useState('');

  // Function to fetch roll numbers from the backend
  const fetchRollNumbers = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/roll-numbers');
      const data = await response.json();
      setRollNumbers(data);
    } catch (error) {
      console.error('Error fetching roll numbers:', error);
    }
  };

  useEffect(() => {
    fetchRollNumbers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rollNumber) return;

    try {
      const response = await fetch('http://localhost:5000/api/roll-numbers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ roll_number: rollNumber }),
      });

      const result = await response.json();

      if (response.ok) {
        // For added entries, show an on-page message.
        setMessage('Roll number added successfully.');
        setRollNumber('');
        fetchRollNumbers(); // Refresh the list
      } else {
        // Show an alert if the roll number already exists or an error occurs.
        window.alert(result.message);
      }
    } catch (error) {
      console.error('Error submitting roll number:', error);
      window.alert('An error occurred while submitting. Please try again.');
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/roll-numbers/${id}`, {
        method: 'DELETE',
      });
      const result = await response.json();
      if (response.ok) {
        setMessage('Roll number deleted successfully.');
        fetchRollNumbers(); // Refresh the list after deletion.
      } else {
        console.error('Deletion failed:', result);
        window.alert(result.message);
      }
    } catch (error) {
      console.error('Error deleting roll number:', error);
      window.alert('Error deleting roll number. Please try again.');
    }
  };
  
  return (
    <div className="App">
      <h1>Coupon Roll Number Entry</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter roll number"
          value={rollNumber}
          onChange={(e) => setRollNumber(e.target.value)}
          required
        />
        <button type="submit">Submit</button>
      </form>
      {message && <p>{message}</p>}

      <h2>All Roll Numbers (Ascending Order)</h2>
      <table>
        <thead>
          <tr>
            <th>Roll Number</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {rollNumbers.map((item) => (
            <tr key={item.id}>
              <td>{item.roll_number}</td>
              <td>
                <button onClick={() => handleDelete(item.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
