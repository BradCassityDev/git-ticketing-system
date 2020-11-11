const router = require('express').Router();
const { User, Issue, Project, Issue_State, Project_State, Issue_User, User_State, Role, Team, Ticket } = require('../../models/index');
const withAdminAuth = require('../../utils/authAdmin');

// Admin - /admin
router.get('/', withAdminAuth, (req, res) => {
    Project.findAll()
        .then(projectData => {
            const projects = projectData.map(project => project.get({ plain: true }));
            console.log(projectData);
            res.render('admin-console', { projects, loggedIn: req.session.loggedIn });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

// Admin Project Details - /admin/project/:id
router.get('/project/:id', withAdminAuth, (req, res) => {
    Project.findOne()
        .then(projectData => {
            res.render('project-details', { loggedIn: req.session.loggedIn });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

// Admin Ticket Management - /admin/ticket
router.get('/ticket', withAdminAuth, (req, res) => {
    Ticket.findAll()
        .then(ticketData => {
            const tickets = ticketData.map(ticket => ticket.get({ plain: true }));

            res.render('ticket-center', { tickets, loggedIn: req.session.loggedIn });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

// Admin Ticket Details - /admin/ticket/:id
router.get('/ticket/:id', withAdminAuth, (req, res) => {
    res.render('ticket-details', { loggedIn: req.session.loggedIn });
});

// Admin User Management - /admin/user
router.get('/user', withAdminAuth, (req, res) => {
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

            res.render('user-center', { users, loggedIn: req.session.loggedIn });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

// Admin User Details - /admin/user/:id
router.get('/user/:id', withAdminAuth, (req, res) => {
    res.render('user-details', { loggedIn: req.session.loggedIn });
});

// Admin Team Management - /admin/team
router.get('/team', withAdminAuth, (req, res) => {
    Team.findAll()
        .then(teamData => {
            const teams = teamData.map(team => team.get({ plain: true }));

            res.render('team-center', { teams, loggedIn: req.session.loggedIn });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

// Admin Team Details - /admin/team/:id
router.get('/team/:id', withAdminAuth, (req, res) => {
    res.render('team-details', { loggedIn: req.session.loggedIn });
});

module.exports = router;