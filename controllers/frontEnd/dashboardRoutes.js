const router = require('express').Router();

// /dashboard/
router.get('/', (req, res) => {
    res.render('developer-console');
});

// Admin console - /admin
router.get('/admin', (req, res) => {
    res.render('admin-console');
});

// Admin Ticket Management - /admin/ticket
router.get('/admin/ticket', (req, res) => {
    res.render('ticket-center');
});

// Admin User Management - /admin/user
router.get('/admin/user', (req, res) => {
    res.render('user-center');
});

module.exports = router;