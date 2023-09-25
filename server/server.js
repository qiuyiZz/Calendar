const express = require('express');
const path = require('path');
const app = express();

const PORT = 3000;
const loginRouter = require('./api/login'); // Require the login router
const logoutRouter = require('./api/logout'); 
const signUpRouter = require('./api/signUp'); 
const createEventRouter = require('./api/createEvent'); 
const deleteEventRouter = require('./api/deleteEvent'); 
const updateEventRouter = require('./api/updateEvent'); 
const generateEventsRouter = require('./api/generateEvents'); 

const session = require('express-session');

// Configure express-session
app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true
}));
// Use the login router for the '/server/api/login' route
app.use('/server/api/login', loginRouter);
// Use the logout router for the /server/api/logout route
app.use('/server/api/logout', logoutRouter);
app.use('/server/api/signUp', signUpRouter);
app.use('/server/api/createEvent', createEventRouter);
app.use('/server/api/deleteEvent', deleteEventRouter);
app.use('/server/api/updateEvent', updateEventRouter);
app.use('/server/api/generateEvents', generateEventsRouter);

// Serve static files
app.use('/static', express.static(path.join(__dirname, '../static')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../static/index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
