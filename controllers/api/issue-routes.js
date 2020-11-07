const router = require('express').Router();
const { issueDetails, createIssue, updateIssue } = require('../../utils/github');
const { User, Issue, Project, Issue_State, Project_State, Issue_User } = require('../../models/index');

const includeArray = [
    {
        model: Project,
        include: {
            model: Project_State,
            attributes: ['name']
        }
    },
    {
        model: Issue_State,
        attributes: ['name']
    },
    {
        model: User,
        attributes: ['id', 'username', 'email', 'phone'],
        through: Issue_User
    }
];

// Get all Issues - /api/issues
router.get('/', (req, res) => {
    Issue.findAll(
        {
            include: includeArray
        }
    )
        .then(issueDate => res.json(issueDate))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

// Get Issue by ID - /api/issues/:id
router.get('/:id', (req, res) => {
    Issue.findOne({
        include: includeArray,
        where: {
            id: req.params.id
        }
    })
        .then(async issueData => {
            if (!issueData) {
                res.status(404).json({ message: 'No issue found by that id' });
                return;
            }
            res.json(issueData);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

// Get Issues related to Project - /api/issues/project/:id
router.get('/project/:id', (req, res) => {
    Project.findOne({
        where: {
            id: req.params.id
        },
        include: [
            {
                model: Issue,
                include: {
                    model: Issue_State,
                    attributes: ['name']
                }
            }
        ]
    })
        .then(issueData => {
            if (!issueData) {
                res.status(404).json({ message: 'No issues found by this project id' });
                return;
            }
            res.json(issueData);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

// Get Issues assigned to User - /api/issues/user/:id
router.get('/user/:id', (req, res) => {
    User.findAll({
        where: {
            id: req.params.id
        },
        include: [
            {
                model: Issue,
                include: {
                    model: Issue_State,
                    attributes: ['name']
                },
                include: {
                    model: Project,
                    attributes: ['name', 'github_username', 'github_repo_name']
                }
            }
        ]
    })
        .then(issueData => {
            if (!issueData) {
                res.status(404).json({ message: 'No issues found with that user id' });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

// Create Issue - /api/issues
router.post('/', (req, res) => {
    // Grab needed values out of request body for issue creation on GitHub
    // const {github_username, github_repo_name, data} = req.body;

    // Create issue on GitHub and return info
    // const githubResult = createIssue(github_username, github_repo_name, data);

    // Create issue in database and assign github_issue_number to associate back
    Issue.create({
        due_date: req.body.due_date,
        priority: req.body.priority,
        github_issue_number: req.body.github_issue_number,
        project_id: req.body.project_id
    })
        .then(issueData => res.json(issueData))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});


// Update Issue - /api/issues/:id
router.put('/:id', (req, res) => {
    // Grab needed values out of request body for issue update on GitHub
    // const {github_username, github_repo_name, github_issue_number, data} = req.body;

    // Update issue on GitHub
    // const githubResult = updateIssue(github_username, github_repo_name, github_issue_number, data);

    // Update Issue in Database
    Issue.update(
        {
            due_date: req.body.due_date,
            priority: req.body.priority,
            github_issue_number: req.body.github_issue_number
        },
        {
            where: {
                id: req.params.id
            }
        }
    )
        .then(issueData => res.json(issueData))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

module.exports = router;