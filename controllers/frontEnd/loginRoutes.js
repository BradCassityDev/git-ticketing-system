const router = require('express').Router();

// Login Page - /login
router.get('/login', (req, res) => {
    res.render('login', { loggedIn: req.session.loggedIn });
});

// Ticket Form Page - /ticket
router.get('/ticket', (req, res) => {
    res.render('client-form', { loggedIn: req.session.loggedIn });
});

// Split Page - /
router.get('/', (req, res) => {
    res.render('index', { loggedIn: req.session.loggedIn });
});

module.exports = router;