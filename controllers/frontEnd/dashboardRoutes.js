const router = require('express').Router();

// /dashboard/
router.get('/', (req, res) => {
    let userId = req.session.user_id;
    res.render('developer-console', { userId });
});

module.exports = router;