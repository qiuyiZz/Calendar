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

// Define the POST route for login
router.post('/', async(req, res) => {
    console.log("Received a POST request at /server/api/login");
    console.log("req.body",req.body);

   
    const { username: user, password: pwd_input } = req.body;

    // Use a prepared statement
    const query = "SELECT user_id, pwd FROM users WHERE username=?";
    console.log("SQL Query:", query);
    console.log("Input Username:", user);
    mysql.query(query, [user], (err, results) => {
        if (err) {
            console.error("Database Error:", err);
            return res.json({
                success: false,
                message: "Database error"
            });}
        if (results.length === 0) {
            console.log("User not exist");
            return res.json({
                success: false,
                message: "User not exist!"
            });
        }

        const { user_id, pwd: pwd_hash } = results[0];
        console.log("Input Password:", pwd_input);
        console.log("Hashed Password:", pwd_hash);

        // Compare the submitted password to the actual password hash
        if (bcrypt.compareSync(pwd_input, pwd_hash)) {
            req.session.user_id = user_id;
            req.session.username = user;
            req.session.token = require('crypto').randomBytes(32).toString('hex');
            console.log("req.session in login.js",req.session)

            return res.json({
                success: true,
                message: "Login succeeded!",
                user_id: req.session.user_id,
                username: req.session.username,
                token: req.session.token
            });
        } else {
            console.log("Password does not match");
            return res.json({
                success: false,
                message: "Password does not match!"
            });
        }
    });
});

module.exports = router; // Export the router instance
