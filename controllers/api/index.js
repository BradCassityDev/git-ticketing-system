const router = require('express').Router();
const userRoutes = require('./user-routes');
const ticketRoutes = require('./ticket-routes');

router.use('/user', userRoutes);
router.use('/ticket', ticketRoutes);

// temp route - /api
router.use('/', (req, res) => {
    res.send('Temporary');
});

module.exports = router;