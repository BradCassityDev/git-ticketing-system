const router = require('express').Router();
const { User, Issue, Project, Issue_State, Project_State, Issue_User, User_State, Role, Team, Ticket, Ticket_State } = require('../../models/index');
const { getRepoIssues, issueDetails, createIssue, updateIssue } = require('../../utils/github');
const withAdminAuth = require('../../utils/authAdmin');

// Admin - /admin
router.get('/', withAdminAuth, (req, res) => {
    Project.findAll({
        include: [
            {
                model: Project_State,
                attributes: ['name']
            }
        ]
    })
        .then(projectData => {
            const projects = projectData.map(project => project.get({ plain: true }));
            const isAdmin = (req.session.role_id === 2) ? true : false;
            res.render('admin-console', { projects, loggedIn: req.session.loggedIn, isAdmin });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

// Admin Project Details - /admin/project/:id
router.get('/project/:id', withAdminAuth, (req, res) => {

    Project.findOne({
        where: {
            id: req.params.id
        },
        include: [
            {
                model: Project_State,
                attributes: ['name']
            },
            {
                model: Issue,
                include: [
                    {
                        model: Issue_State,
                        attributes: ['name']
                    },
                    {
                        model: User,
                        attributes: ['id', 'username', 'email', 'phone']
                    }
                ]
            }
        ]
    })
        .then(async issueData => {
            if (!issueData) {
                res.status(404).json({ message: 'No issues found by this project id' });
                return;
            }

            // return all GitHub issues for this repository
            const githubRepoIssues = await getRepoIssues(issueData.github_username, issueData.github_repo_name);

            // Map GitHub issues with our db issues
            for (let i = 0; i < issueData.issues.length; i++) {
                // Loop through GitHub repo issues and include in DB issues
                for (let x = 0; x < githubRepoIssues.length; x++) {
                    // Check if issue numbers match between GitHub and our DB
                    if (githubRepoIssues[x].number === parseInt(issueData.issues[i].dataValues.github_issue_number)) {
                        issueData.issues[i].dataValues.github_issue_details = githubRepoIssues[x];
                    }
                }
            }

            const project = issueData.get({ plain: true });
            const isAdmin = (req.session.role_id === 2) ? true : false;
            res.render('project-details', { project, loggedIn: req.session.loggedIn, isAdmin });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

// Admin Ticket Management - /admin/ticket
router.get('/ticket', withAdminAuth, (req, res) => {
    Ticket.findAll({
        include: [
            {
                model: Ticket_State,
                attributes: ["name"]
            }
        ]
    })
        .then(ticketData => {
            const tickets = ticketData.map(ticket => ticket.get({ plain: true }));
            const isAdmin = (req.session.role_id === 2) ? true : false;
            res.render('ticket-center', { tickets, loggedIn: req.session.loggedIn, isAdmin });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

// Admin Ticket Details - /admin/ticket/:id
router.get('/ticket/:id', withAdminAuth, (req, res) => {
    Ticket.findOne({
        where: {
            id: req.params.id
        }
    })
        .then(ticketData => {
            if (!ticketData) {
                res.status(404).json({ message: 'unable to find a ticket by that id' });
                return;
            }

            const ticket = ticketData.get({ plain: true });
            const isAdmin = (req.session.role_id === 2) ? true : false;
            res.render('ticket-details', { ticket, loggedIn: req.session.loggedIn, isAdmin });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
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
            const isAdmin = (req.session.role_id === 2) ? true : false;
            res.render('user-center', { users, loggedIn: req.session.loggedIn, isAdmin });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

// Admin User Details - /admin/user/:id
router.get('/user/:id', withAdminAuth, (req, res) => {
    User.findOne(
        {
            where: {
                id: req.params.id
            },
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
            const user = userData.get({ plain: true });
            const isAdmin = (req.session.role_id === 2) ? true : false;
            res.render('user-details', { user, loggedIn: req.session.loggedIn, isAdmin });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

// Admin Team Management - /admin/team
router.get('/team', withAdminAuth, (req, res) => {
    Team.findAll({
        include: [
            {
                model: User,
                attributes: ['username']
            }
        ]
    })
        .then(teamData => {
            console.log(teamData)
            const teams = teamData.map(team => team.get({ plain: true }));
            const isAdmin = (req.session.role_id === 2) ? true : false;
            res.render('team-center', { teams, loggedIn: req.session.loggedIn, isAdmin });
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