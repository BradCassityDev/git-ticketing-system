const router = require('express').Router();

// Login Page - /login
router.get('/login', (req, res) => {
    const isAdmin = (req.session.role_id === 2) ? true : false;
    res.render('login', { loggedIn: req.session.loggedIn, isAdmin });
});

// Ticket Form Page - /ticket
router.get('/ticket', (req, res) => {
    const isAdmin = (req.session.role_id === 2) ? true : false;
    res.render('client-form', { loggedIn: req.session.loggedIn, isAdmin });
});

// Split Page - /
router.get('/', (req, res) => {
    const isAdmin = (req.session.role_id === 2) ? true : false;
    res.render('index', { loggedIn: req.session.loggedIn, isAdmin });
});

module.exports = router;