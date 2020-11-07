const router = require('express').Router();
const {getRepoIssues, issueDetails, createIssue, updateIssue} = require('../../utils/github');
const {User, Issue, Project, Issue_State, Project_State, Issue_User} = require('../../models/index');

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
        attributes: ['id', 'username', 'email', 'phone']
    }
];

// Get all Issues - /api/issue
router.get('/', (req, res) => {
    Issue.findAll(
        {
            include: includeArray
        }
    )
        .then(issueData => {
            res.json(issueData);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

// Get Issue by ID - /api/issue/:id
router.get('/:id', (req, res) => {
    Issue.findOne({
        include: includeArray,
        where: {
            id: req.params.id
        }
    })
        .then(async issueData => {
            if (!issueData) {
                res.status(404).json({message: 'No issue found by that id'});
                return;
            }

            // Retrieve associated issue details from GitHub and return
            const {github_username, github_repo_name} = issueData.project;
            issueData.dataValues.github_issue_details = await issueDetails(github_username, github_repo_name, issueData.github_issue_number);

            res.json(issueData);

        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

// Get Issues related to Project - /api/issue/project/:id
router.get('/project/:id', (req, res) => {
    Project.findOne({
        where: {
            id: req.params.id
        },
        include: [
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
                res.status(404).json({message: 'No issues found by this project id'});
                return;
            }

            // return all GitHub issues for this repository
            // Option 1
            // issueData.dataValues.github_repo_issues = await getRepoIssues(issueData.github_username, issueData.github_repo_name);
            
            // Option 2
            // for (let i = 0; i < issueData.issues.length; i++) {
            //     issueData.issues[i].dataValues.dagithub_issue_details = await issueDetails(issueData.github_username, issueData.github_repo_name, issueData.dataValues.issues[i].github_issue_number);
            //     console.log(issueData.issues[i].dataValues);
            // }

            res.json(issueData);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

// Get Issues assigned to User - /api/issue/user/:id
router.get('/user/:id', (req, res) => {
    User.findOne({
        where: {
            id: req.params.id
        },
        include: [
            {
                model: Issue,
                include: [
                    {
                        model: Issue_State,
                        attributes: ['name'] 
                    },
                    {
                        model: Project,
                        attributes: ['name', 'github_username', 'github_repo_name']
                    },
                    {
                        model: User,
                        attributes: ['id', 'username', 'email', 'phone']
                    }
                ]
            }
        ]
    })
        .then(issueData => {
            if (!issueData) {
                res.status(404).json({message: 'No issues found with that user id'});
                return;
            }
            res.json(issueData);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

// Create Issue - /api/issue
router.post('/', async (req, res) => {
    // Look up project details to grab github_username and github_repo_name
    const projectDetails = await Project.findOne({
        where: {
            id: req.body.project_id
        }
    })
        .then(projectData => {
            if (!projectData) {
                res.status(404).json({message: 'No project found with the provided id'});
                return;
            }
            return projectData;
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
            return;
        });

    // Create issue on GitHub and return info
    const githubResult = await createIssue(projectDetails.github_username, projectDetails.github_repo_name, req.body.data);

    // Create issue in database and assign github_issue_number to associate back
    Issue.create({
        due_date: req.body.due_date,
        priority: req.body.priority,
        github_issue_number: githubResult.number,
        project_id: req.body.project_id
    })
        .then(issueData => res.json(issueData))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});


// Update Issue - /api/issue/:id
router.put('/:id', async (req, res) => {
    // Look up project details to grab github_username and github_repo_name
    const projectDetails = await Project.findOne({
        where: {
            id: req.body.project_id
        }
    })
        .then(projectData => {
            if (!projectData) {
                res.status(404).json({message: 'No project found with the provided id'});
                return;
            }
            return projectData;
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
            return;
        });

    // Update Issue in Database
    Issue.update(
        {
            due_date: req.body.due_date,
            priority: req.body.priority,
            github_issue_number: githubResult.number
        }, 
        {
            where: {
                id: req.params.id
            }
        }
    )
        .then(issueData => {
            if (!issueData) {
                res.status(404).json({message: 'No issue found with this id'});
                return;
            }

            // Update issue on GitHub
            const githubResult = updateIssue(projectDetails.github_username, projectDetails.github_repo_name, req.body.github_issue_number, req.body.data);


            res.json(issueData);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

module.exports = router;