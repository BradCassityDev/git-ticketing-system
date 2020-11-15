const router = require('express').Router();
const withAuth = require('../../utils/auth');

// /dashboard/
router.get('/', withAuth, (req, res) => {
    const userId = req.session.user_id;
    const userName = req.session.username;
    const isAdmin = (req.session.role_id === 2) ? true : false;
    res.render('developer-console', { userId, userName, loggedIn: req.session.loggedIn, isAdmin });
});

module.exports = router;