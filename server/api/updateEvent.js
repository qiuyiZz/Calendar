const express = require('express');
const router = express.Router(); // Create a router instance instead of a new express app
const bodyParser = require('body-parser');
const mysql = require('mysql');
const session = require('express-session');
const moment = require('moment-timezone');

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
    const { token, event_id, title, date, startTime, endTime, type } = req.body;

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

    if (!event_id || !title || !date || !startTime || !endTime || !type) {
        return res.json({
            success: false,
            message: "All fields are required."
        });
    }

    const format = 'YYYY-MM-DD HH:mm';
    const startDateTime = `${date} ${startTime}`;
    const endDateTime = `${date} ${endTime}`;
    const startMoment = moment.tz(startDateTime, format, 'America/Chicago');
    const endMoment = moment.tz(endDateTime, format, 'America/Chicago');

    if (!startMoment.isValid() || !endMoment.isValid() || startMoment.isAfter(endMoment)) {
        return res.json({
            success: false,
            message: "Invalid date or time inputs."
        });
    }

    const query = "UPDATE events SET title=?, create_date=?, start_time=?, end_time=?, type=? WHERE event_id=? AND user_id=?";
    db.query(query, [title, date, startMoment.format(format), endMoment.format(format), type, event_id, req.session.user_id], (err) => {
        if (err) {
            return res.json({
                success: false,
                message: `Error updating event: ${err.message}`
            });
        }
        res.json({
            success: true,
            message: "Event updated",
            event_id: event_id,
            title: title,
            date: date,
            startTime: startTime,
            endTime: endTime,
            type: type
        });
    });
});

module.exports = router; // Export the router instance
