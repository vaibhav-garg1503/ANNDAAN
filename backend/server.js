const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

// Serve static files from the frontend home directory
app.use(express.static(path.join(__dirname, '../frontend/home')));

// Serve the home page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/home/home.html'));
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
