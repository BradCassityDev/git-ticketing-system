const router = require('express').Router();

// Login Page - /login
router.get('/login', (req, res) => {
    res.render('login');
});

// Ticket Form Page - /ticket
router.get('/ticket', (req, res) => {
    res.render('client-form');
});

// Split Page - /
router.get('/', (req, res) => {
    res.render('index');
});

module.exports = router;