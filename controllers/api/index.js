const router = require('express').Router();

// temp route - /api
router.use('/', (req, res) => {
    res.send('Temporary');
});

module.exports = router;