const express = require('express');
const router = express.Router(); // Create a router instance instead of a new express app
const bodyParser = require('body-parser');
const mysql = require('./database');
const session = require('express-session');
const escapeHtml = require('escape-html'); // For escaping HTML strings
const moment = require('moment-timezone');

const format = 'YYYY-MM-DD HH:mm';
const format2 = 'YYYY-MM-DD';

// Middleware configurations
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
router.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true
}));

router.post('/', (req, res) => {
    console.log("req.session in generateEvents.js",req.session)
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
    
    mysql.query(query, [userId], (err, results) => {
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
            data.date_list.push(moment(row.create_date).format(format2)); // Format date
            data.start_time_list.push(moment(row.start_time).format(format)); // Format start time
            data.end_time_list.push(moment(row.end_time).format(format)); // Format end time
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