const router = require('express').Router();
const withAuth = require('../../utils/auth');

// /dashboard/
router.get('/', withAuth, (req, res) => {
    const userId = req.session.user_id;
    const userName = req.session.username;
    res.render('developer-console', { userId, userName, loggedIn: req.session.loggedIn });
});

module.exports = router;