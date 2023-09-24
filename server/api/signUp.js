const express = require('express');
const router = express.Router(); // Create a router instance instead of a new express app
const bodyParser = require('body-parser');
const mysql = require('./database'); // Assuming you've converted database.php as shown before
const bcrypt = require('bcryptjs');
const session = require('express-session');


// Middleware to parse POST data
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

// Setup session
router.use(session({
    secret: 'your_secret_key', 
    resave: false,
    saveUninitialized: true
}));

router.post('/', async (req, res) => {
    console.log("Received a POST request at /server/api/signUp");
    const { username, password } = req.body;
    

    // Input validations
    if (!username) {
        return res.json({
            success: false,
            message: "Username cannot be empty"
        });
    }

    if (!password) {
        return res.json({
            success: false,
            message: "Password cannot be empty"
        });
    }

    if (!/^[a-zA-Z0-9_\-]+$/.test(username)) {
        return res.json({
            success: false,
            message: "Invalid username"
        });
    }

    if (password.length < 4) {
        return res.json({
            success: false,
            message: "Password must have at least 4 characters"
        });
    }

    // Check if username is taken
    const queryCheck = 'SELECT user_id FROM users WHERE username = ?';
    mysql.query(queryCheck, [username], async (err, results) => {
        if (err) {
            return res.json({
                success: false,
                message: "Database error"
            });
        }

        if (results.length > 0) {
            return res.json({
                success: false,
                message: "Username has been taken"
            });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log("Input Password:", password);

        // Insert user into database
        const queryInsert = 'INSERT INTO users (username, pwd) VALUES (?, ?)';
        mysql.query(queryInsert, [username, hashedPassword], (err, results) => {
            if (err) {
                return res.json({
                    success: false,
                    message: "Database error"
                });
            }

            req.session.user_id = results.insertId;
            req.session.username = username;
            req.session.token = require('crypto').randomBytes(32).toString('hex');

            res.json({
                success: true,
                message: "Sign up succeeded!",
                user_id: req.session.user_id,
                username: req.session.username,
                token: req.session.token
            });
        });
    });
});

module.exports = router; // Export the router instance
