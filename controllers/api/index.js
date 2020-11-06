const router = require('express').Router();
const userRoutes = require('./user-routes');

router.use('/user', userRoutes);

// temp route - /api
router.use('/', (req, res) => {
    res.send('Temporary');
});

module.exports = router;