const express = require('express');
const bodyParser = require('body-parser');
const sql = require('mssql');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors({
    origin: 'http://127.0.0.1:5500' // Replace with your frontend URL
}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

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
        const result = await sql.query`SELECT DISTINCT Username, Location, TotalDonations FROM Users as U, Donors as D
            WHERE Role = 'Donor' AND U.UserID = D.UserID`;

        res.json(result.recordset);
    } catch (err) {
        console.error('Error fetching donors:', err);
        res.status(500).send('Error fetching donors');
    } finally {
        await sql.close();
    }
});

// Endpoint to handle hostel registration
app.post('/register_hostel', async (req, res) => {
    const { username, email, password, contact, location } = req.body;

    let pool;
    try {
        // Connect to the database
        pool = await sql.connect(config);

        // Check if username already exists
        const userCheck = await pool.request()
            .input('username', sql.VarChar, username)
            .query('SELECT * FROM Users WHERE Username = @username');

        if (userCheck.recordset.length > 0) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        // Check if email already exists
        const emailCheck = await pool.request()
            .input('email', sql.VarChar, email)
            .query('SELECT * FROM Users WHERE Email = @Email');

        if (emailCheck.recordset.length > 0) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        // Insert the new user into the Users table
        const insertQuery1 = `
            INSERT INTO Users (Username, Email, Password, Contact, Location, Role)
            VALUES (@username, @Email, @password, @contact, @location, 'Donor');
        `;
        await pool.request()
            .input('username', sql.VarChar, username)
            .input('email', sql.VarChar, email)
            .input('password', sql.VarChar, password)
            .input('contact', sql.BigInt, contact)
            .input('location', sql.VarChar, location)
            .query(insertQuery1);

        // Retrieve the UserID of the newly inserted user
        const userIdQuery = await pool.request()
            .input('username', sql.VarChar, username)
            .query('SELECT UserID FROM Users WHERE Username = @username');
        
        if (userIdQuery.recordset.length === 0) {
            return res.status(500).json({ message: 'Failed to retrieve UserID after insertion' });
        }

        const userId = userIdQuery.recordset[0].UserID;

        // Insert into the Donors table with the retrieved UserID and an initial TotalDonations of 0
        const insertQuery2 = `
            INSERT INTO Donors (UserID, TotalDonations)
            VALUES (@userId, 0);
        `;
        await pool.request()
            .input('userId', sql.Int, userId)
            .query(insertQuery2);

        res.status(200).send('Hostel registered successfully!');
    } catch (err) {
        console.error('Error registering hostel:', err);
        res.status(500).json({ error: 'Error registering hostel', details: err.message });
    } finally {
        if (pool) {
            pool.close(); // Close the connection pool after the request is handled
        }
    }
});


// Endpoint to handle agency registration
app.post('/register_agency', async (req, res) => {
    const { username, email, password, contact, location } = req.body;

    let pool;
    try {
        // Connect to the database
        pool = await sql.connect(config);

        // Check if username already exists
        const userCheck = await pool.request()
            .input('username', sql.VarChar, username)
            .query('SELECT * FROM Users WHERE Username = @username');

        if (userCheck.recordset.length > 0) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        // Check if email already exists
        const emailCheck = await pool.request()
            .input('email', sql.VarChar, email)
            .query('SELECT * FROM Users WHERE Email = @Email');

        if (emailCheck.recordset.length > 0) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        // Insert the new user into the Users table
        const insertQuery1 = `
            INSERT INTO Users (Username, Email, Password, Contact, Location, Role)
            VALUES (@username, @Email, @password, @contact, @location, 'Recipient');
        `;
        await pool.request()
            .input('username', sql.VarChar, username)
            .input('email', sql.VarChar, email)
            .input('password', sql.VarChar, password)
            .input('contact', sql.BigInt, contact)
            .input('location', sql.VarChar, location)
            .query(insertQuery1);

        // Retrieve the UserID of the newly inserted user
        const userIdQuery = await pool.request()
            .input('username', sql.VarChar, username)
            .query('SELECT UserID FROM Users WHERE Username = @username');
        
        if (userIdQuery.recordset.length === 0) {
            return res.status(500).json({ message: 'Failed to retrieve UserID after insertion' });
        }

        const userId = userIdQuery.recordset[0].UserID;

        // Insert into the Recipients table with the retrieved UserID
        const insertQuery2 = `
            INSERT INTO Recipients (UserID)
            VALUES (@userId);
        `;
        await pool.request()
            .input('userId', sql.Int, userId)
            .query(insertQuery2);

        res.status(200).send('Agency registered successfully!');
    } catch (err) {
        console.error('Error registering agency:', err);
        res.status(500).json({ error: 'Error registering agency', details: err.message });
    } finally {
        if (pool) {
            pool.close(); // Close the connection pool after the request is handled
        }
    }
});


// Start server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
