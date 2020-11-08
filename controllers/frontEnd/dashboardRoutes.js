const router = require('express').Router();

// /dashboard/
router.get('/', (req, res) => {
    res.render('developer-console');
});

module.exports = router;