const router = require('express').Router();

// Admin - /admin
router.get('/', (req, res) => {
    res.render('admin-console');
});

// Admin Ticket Management - /admin/ticket
router.get('/ticket', (req, res) => {
    res.render('ticket-center');
});

// Admin User Management - /admin/user
router.get('/user', (req, res) => {
    res.render('user-center');
});

module.exports = router;