const express = require('express');
const router = express.Router(); // Create a router instance instead of a new express app
const bodyParser = require('body-parser');
const mysql = require('mysql');
const session = require('express-session');


const db = mysql.createConnection({
    host: 'localhost',
    user: 'wustl_inst',
    password: 'wustl_pass',
    database: 'events'
});

// Middleware configurations
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
router.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true
}));

router.post('/', (req, res) => {
    const { token, event_id } = req.body;

    if (req.session.token && req.session.username && req.session.user_id) {
        if (req.session.token !== token) {
            return res.json({
                success: false,
                message: "Cross-site request forgery detected"
            });
        }
    } else {
        return res.json({
            success: false,
            message: "User is not logged in"
        });
    }

    const userId = req.session.user_id;
    const query = "DELETE FROM events WHERE event_id=? AND user_id=?";
    
    db.query(query, [event_id, userId], (err) => {
        if (err) {
            return res.json({
                success: false,
                message: `Error deleting event: ${err.message}`
            });
        }
        res.json({
            success: true,
            message: "Events deleted successfully"
        });
    });
});

module.exports = router; // Export the router instance