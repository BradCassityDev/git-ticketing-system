const router = require('express').Router();
const { User, Issue, Project, Issue_State, Project_State, Issue_User, User_State, Role, Team, Ticket } = require('../../models/index');

// Admin - /admin
router.get('/', (req, res) => {
    Project.findAll()
        .then(projectData => {
            const projects = projectData.map(project => project.get({ plain: true }));
            console.log(projectData);
            res.render('admin-console', { projects });
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
    Ticket.findAll()
        .then(ticketData => {
            const tickets = ticketData.map(ticket => ticket.get({ plain: true }));

            res.render('ticket-center', { tickets });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

// Admin Ticket Details - /admin/ticket/:id
router.get('/ticket/:id', (req, res) => {
    res.render('ticket-details');
});

// Admin User Management - /admin/user
router.get('/user', (req, res) => {
    User.findAll(
        {
            include: [
                {
                    model: Team,
                    attributes: ['name']
                },
                {
                    model: User_State,
                    attributes: ['name']
                },
                {
                    model: Role,
                    attributes: ['name']
                },
            ]
        }
    )
        .then(userData => {
            const users = userData.map(user => user.get({ plain: true }));

            res.render('user-center', { users });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

// Admin User Details - /admin/user/:id
router.get('/user/:id', (req, res) => {
    res.render('user-details');
});

// Admin Team Management - /admin/team
router.get('/team', (req, res) => {
    Team.findAll()
        .then(teamData => {
            const teams = teamData.map(team => team.get({ plain: true }));

            res.render('team-center', { teams });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

// Admin Team Details - /admin/team/:id
router.get('/team/:id', (req, res) => {
    res.render('team-details');
});

module.exports = router;