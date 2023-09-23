const express = require('express');
const router = express.Router(); // Create a router instance instead of a new express app
const bodyParser = require('body-parser');
const mysql = require('mysql');
const session = require('express-session');
const escapeHtml = require('escape-html'); // For escaping HTML strings


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
    if (req.session.token && req.session.username && req.session.user_id) {
        if (req.session.token !== req.body.token) {
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
    const query = "SELECT * FROM events WHERE events.user_id=?";
    
    db.query(query, [userId], (err, results) => {
        if (err) {
            return res.json({
                success: false,
                message: `Error fetching events: ${err.message}`
            });
        }

        let data = {
            event_id_list: [],
            title_list: [],
            date_list: [],
            start_time_list: [],
            end_time_list: [],
            type_list: [],
            user_id_list: []
        };

        results.forEach(row => {
            data.event_id_list.push(escapeHtml(row.event_id));
            data.title_list.push(escapeHtml(row.title));
            data.date_list.push(escapeHtml(row.create_date));
            data.start_time_list.push(escapeHtml(row.start_time));
            data.end_time_list.push(escapeHtml(row.end_time));
            data.type_list.push(escapeHtml(row.type));
            data.user_id_list.push(escapeHtml(row.user_id));
        });

        res.json({
            success: true,
            message: "Events fetched successfully",
            events: data
        });
    });
});

module.exports = router; // Export the router instance