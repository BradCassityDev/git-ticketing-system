const router = require('express').Router();
const { User, Issue, Project, Issue_State, Project_State, Issue_User, Ticket } = require('../../models/index');

// Admin - /admin
router.get('/', (req, res) => {
    Project.findAll()
        .then(projectData => {
            const projects = projectData.map(project => project.get({plain: true}));
            console.log(projectData);
            res.render('admin-console', {projects});
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

// Admin Project Details - /admin/project/:id
router.get('/project/:id', (req, res) => {
    Project.findOne()
        .then(projectData => {
            res.render('project-details');
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

// Admin Ticket Management - /admin/ticket
router.get('/ticket', (req, res) => {
    res.render('ticket-center');
});

// Admin Ticket Details - /admin/ticket/:id
router.get('/ticket/:id', (req, res) => {
    res.render('ticket-details');
});

// Admin User Management - /admin/user
router.get('/user', (req, res) => {
    res.render('user-center');
});

// Admin User Details - /admin/user/:id
router.get('/user/:id', (req, res) => {
    res.render('user-details');
});

// Admin Team Management - /admin/team
router.get('/team', (req, res) => {
    res.render('team-center');
});

// Admin Team Details - /admin/team/:id
router.get('/team/:id', (req, res) => {
    res.render('team-details');
});

module.exports = router;