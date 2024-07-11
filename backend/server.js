const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const sql = require('mssql');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors({
    origin: 'http://127.0.0.1:5500' //frontend URL
}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Configure Multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, 'uploads/'));
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});
const upload = multer({ storage: storage });

// MSSMS configuration
const config = {
    user: 'sand',
    password: 'sandr3120',
    server: 'localhost\\SQLEXPRESS',
    database: 'foodDB',
    options: {
        trustServerCertificate: true, // change to false for production
        encrypt: true, 
        enableArithAbort: true
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

            const userQuery = await pool.request()
            .input('username', sql.VarChar, username)
            .query('SELECT * FROM Users WHERE Username = @username');

            if (userQuery.recordset.length === 0) {
                return res.status(500).json({ message: 'Failed to retrieve user after insertion' });
            }

            const registeredUser = userQuery.recordset[0];
            
            res.status(200).send(registeredUser);

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


            const userQuery = await pool.request()
            .input('username', sql.VarChar, username)
            .query('SELECT * FROM Users WHERE Username = @username');

            if (userQuery.recordset.length === 0) {
                return res.status(500).json({ message: 'Failed to retrieve user after insertion' });
            }

            const registeredUser = userQuery.recordset[0];
            
            res.status(200).send(registeredUser);
    } catch (err) {
        console.error('Error registering agency:', err);
        res.status(500).json({ error: 'Error registering agency', details: err.message });
    } finally {
        if (pool) {
            pool.close(); // Close the connection pool after the request is handled
        }
    }
});

app.post('/login', async (req, res) => {
    const { emailOrUsername, password } = req.body;

    try {
        // Connect to database
        await sql.connect(config);

        // Query to check if user exists and verify credentials
        const result = await sql.query`
            SELECT * FROM Users
            WHERE (Email = ${emailOrUsername} OR Username = ${emailOrUsername})
            AND Password = ${password}
        `;

        // If user exists and credentials are correct
        if (result.recordset.length > 0) {
            const user = result.recordset[0];

            // Respond with a success message and username
            res.status(200).json({ success: true, message: 'Login successful', Username: user.Username, Role: user.Role});
        } else {
            // If credentials are incorrect or user doesn't exist
            res.status(401).json({ success: false, message: 'Invalid credentials. Please try again.' });
        }
    } catch (error) {
        console.error('Error during login:', error.message);
        res.status(500).json({ success: false, message: 'Internal server error' });
    } finally {
        // Close SQL connection
        await sql.close();
    }
    
});

// POST endpoint to handle form submission
app.post('/submit-donation', upload.single('foodImage'), async (req, res) => {
    try {
      const { foodItems, quantity, username } = req.body;
  
      let pool = await sql.connect(config);
  
      // Retrieve DonorID based on Username
      const result = await pool.request()
        .input('username', sql.VarChar, username)
        .query('SELECT D.DonorID FROM Users U INNER JOIN Donors D ON U.UserID = D.UserID WHERE U.Username = @username');
  
      if (result.recordset.length === 0) {
        return res.status(404).json({ message: 'Donor not found' });
      }
  
      const donorID = result.recordset[0].DonorID;
      const imagePath = req.file ? req.file.path : null;
  
      // Insert into Donations table
      await pool.request()
        .input('donorID', sql.Int, donorID)
        .input('foodItems', sql.VarChar(100), foodItems)
        .input('quantity', sql.Int, quantity)
        .input('imagePath', sql.VarChar(255), imagePath)
        .query('INSERT INTO Donations (DonorID, FoodItems, Quantity, ImagePath) VALUES (@donorID, @foodItems, @quantity, @imagePath)');
  
      // Update TotalDonations in Donors table
      const userIdQuery = await pool.request()
        .input('username', sql.VarChar, username)
        .query('SELECT UserID FROM Users WHERE Username = @username');
  
      if (userIdQuery.recordset.length === 0) {
        return res.status(500).json({ message: 'Failed to retrieve UserID after insertion' });
      }
  
      const userId = userIdQuery.recordset[0].UserID;
  
      await pool.request()
        .input('userID', sql.Int, userId)
        .input('quantity', sql.Int, quantity)
        .query('UPDATE Donors SET TotalDonations = TotalDonations + @quantity WHERE UserID = @userID');
  
      console.log('Donation submitted successfully');
      res.status(201).json({ message: 'Donation submitted successfully!' });
    } catch (err) {
      console.error('Error submitting donation:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  app.get('/donations', async (req, res) => {
    try {
        await sql.connect(config);
        const result = await sql.query`SELECT * FROM Donations`;

        res.json(result.recordset);
    } catch (err) {
        console.error('Error fetching donors:', err);
        res.status(500).send('Error fetching donors');
    } finally {
        await sql.close();
    }
});

    // Order creation endpoint
app.post('/order', async (req, res) => {
    const { username, donationID, foodItems, quantity } = req.body;

    try {
        // Connect to the database
        let pool = await sql.connect(config);

        // Retrieve RecipientID based on username
        let result = await pool.request()
            .input('username', sql.VarChar, username)
            .query(`SELECT R.RecipientID FROM Users U INNER JOIN Recipients R ON U.UserID = R.UserID WHERE U.Username = '${username}'`);

        if (result.recordset.length === 0) {
            return res.status(404).json({ message: 'Recipient not found' });
        }

        const recipientID = result.recordset[0].RecipientID;

        // Insert order into Orders table
        await pool.request()
            .input('recipientID', sql.Int, recipientID)
            .input('foodItems', sql.VarChar, foodItems)
            .input('quantity', sql.Int, quantity)
            .query('INSERT INTO Orders (RecipientID, FoodItems, Quantity) VALUES (@recipientID, @foodItems, @quantity)');

        await pool.request()
        .input('donationID', sql.Int, donationID)
        .query(`DELETE FROM Donations WHERE DonationID = @donationID`);

        res.status(201).json({ message: 'Order created successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Endpoint to fetch orders for a specific recipient
app.get('/orders/:username', async (req, res) => {
    const { username } = req.params;

    try {
        // Connect to the database
        let pool = await sql.connect(config);

        // Retrieve RecipientID based on username
        let result = await pool.request()
            .input('username', sql.VarChar, username)
            .query(`SELECT R.RecipientID
                    FROM Users U
                    INNER JOIN Recipients R ON U.UserID = R.UserID
                    WHERE U.Username = @username`);

        if (result.recordset.length === 0) {
            return res.status(404).json({ message: 'Recipient not found' });
        }

        const recipientID = result.recordset[0].RecipientID;

        // Fetch orders for the recipient
        let ordersResult = await pool.request()
            .input('recipientID', sql.Int, recipientID)
            .query(`SELECT OrderID, FoodItems, Quantity, OrderedAt
                    FROM Orders
                    WHERE RecipientID = @recipientID`);

        const orders = ordersResult.recordset;
        res.json({ orders });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Start server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
