const express = require('express');
const sql = require('mssql');
const cors = require('cors');

const app = express();

app.use(cors({
    origin: 'http://127.0.0.1:5500' // Replace with your frontend URL
  }));
  
// MSSMS configuration
const config = {
  user: 'sand',
  password: 'sandr3120',
  server: 'localhost\\SQLEXPRESS', 
  database: 'foodDB',
  options: {
    trustServerCertificate: true // change to false for production
  }
};

// Endpoint to fetch donors
app.get('/donors', async (req, res) => {
  try {
    await sql.connect(config);
    const result = await sql.query`SELECT * FROM Donors`;

    res.json(result.recordset);
  } catch (err) {
    console.error('Error fetching donors:', err);
    res.status(500).send('Error fetching donors');
  } finally {
    await sql.close();
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
