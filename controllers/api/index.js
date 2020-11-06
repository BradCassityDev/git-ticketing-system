const router = require('express').Router();
const userRoutes = require('./user-routes');
const projectRoutes = require('./project-routes');
const ticketRoutes = require('./ticket-routes');

router.use('/user', userRoutes);
router.use('/ticket', ticketRoutes);
router.use('/project', projectRoutes);

// temp route - /api
router.use('/', (req, res) => {
    res.send('Temporary');
});

module.exports = router;