const express = require('express');
const router = express.Router(); // Create a router instance
const bodyParser = require('body-parser');
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

router.post('/', (req, res) => {
    // Check if the user is logged in (session exists)
    if (!req.session) {
        return res.json({
            success: false,
            message: "User is not logged in"
        });
    }

    // Check for CSRF token
    if (req.body.token !== req.session.token) {
        return res.json({
            success: false,
            message: "Cross-site request forgery detected"
        });
    }

    // Destroy the session
    req.session.destroy((err) => {
        if (err) {
            return res.json({
                success: false,
                message: "Logout error"
            });
        }
        res.json({
            success: true
        });
    });
});

module.exports = router; // Export the router instance
