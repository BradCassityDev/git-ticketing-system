const router = require('express').Router();
const { getRepoIssues, issueDetails, createIssue, updateIssue } = require('../../utils/github');
const { User, Issue, Project, Issue_State, Project_State, Issue_User, Ticket } = require('../../models/index');
const withAuth = require('../../utils/auth');
const sendNotification = require('../../utils/email-notification');

const includeArray = [
    {
        model: Issue_State,
        attributes: ['name']
    },
    {
        model: Project,
        include: {
            model: Project_State,
            attributes: ['name']
        }
    },
    {
        model: User,
        attributes: ['id', 'username', 'email', 'phone']
    }
];

// Get all /api/issue - /api/issue
router.get('/', withAuth, (req, res) => {
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
router.get('/:id', withAuth, (req, res) => {
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

            // Retrieve associated issue details from GitHub and return
            const { github_username, github_repo_name } = issueData.project;
            issueData.dataValues.github_issue_details = await issueDetails(github_username, github_repo_name, issueData.github_issue_number);

            res.json(issueData);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

// Get /api/issue related to Project - /api/issue/project/:id
router.get('/project/:id', withAuth, (req, res) => {
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

            res.json(issueData);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

// Get /api/issue assigned to User - /api/issue/user/:id
router.get('/user/:id', withAuth, (req, res) => {
    User.findOne({
        where: {
            id: req.params.id
        },
        include: [
            {
                model: Issue,
                through: Issue_User,
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
        .then(async issueData => {
            if (!issueData) {
                res.status(404).json({ message: 'No /api/issue found with that user id' });
                return;
            }

            // Initialize projectsArr to store unique projects
            let projectsArr = [];

            // Loop through returned issues and lookup associated projects
            for (let i = 0; i < issueData.issues.length; i++) {
                let projectObj = {
                    github_username: issueData.issues[i].project.github_username,
                    github_repo_name: issueData.issues[i].project.github_repo_name
                };

                // Check if this repo/username already exists in projectsArr
                // If so, don't include
                let uniqueItem = true;
                if (projectsArr.length > 0) {
                    for (let x = 0; x < projectsArr.length; x++) {
                        if (projectObj.github_username === projectsArr[x].github_username
                            && projectObj.github_repo_name === projectsArr[x].github_repo_name) {
                            uniqueItem = false;
                        }
                    }
                }

                // Include in new array
                if (uniqueItem) {
                    projectsArr.push(projectObj);
                }
            }

            // if projects exist return all issues for each project and map to user issue before reutrning
            for (let p = 0; p < projectsArr.length; p++) {
                const githubResults = await getRepoIssues(projectsArr[p].github_username, projectsArr[p].github_repo_name);

                for (let x = 0; x < issueData.issues.length; x++) {
                    const repoUser = issueData.issues[x].project.github_username;
                    const repoName = issueData.issues[x].project.github_repo_name;
                    const issueNum = issueData.issues[x].github_issue_number;

                    const url = `https://api.github.com/repos/${repoUser}/${repoName}/issues/${issueNum}`;

                    // Loop and match github issues to our db issues
                    for (let i = 0; i < githubResults.length; i++) {
                        if (url == githubResults[i].url) {
                            issueData.issues[x].dataValues.github_issue_details = githubResults[i];
                        }
                    }
                }
            }

            res.json(issueData);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

// Create Issue - /api/issue
router.post('/', withAuth, async (req, res) => {
    // Assign current user to the assignees going to gethub
    req.body.data.assignees = [req.session.username];

    // Look up project details to grab github_username and github_repo_name
    const projectDetails = await Project.findOne({
        where: {
            id: req.body.project_id
        }
    })
        .then(projectData => {
            if (!projectData) {
                res.status(404).json({ message: 'No project found with the provided id' });
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
        project_id: req.body.project_id,
        issue_state_id: 1,
    })
        .then(issueData => {
            // Logged in user to the created issue
            Issue_User.create({
                user_id: req.session.user_id,
                issue_id: issueData.id
            });

            res.json(issueData)
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

// Create Issue from Ticket - /api/issue/ticket
router.post('/ticket', withAuth, (req, res) => {
    // Get needed values from Ticket id
    // Get project ticket will be assigned to from request body

    // Create issue on GitHub and return info
    // const githubResult = createIssue(github_username, github_repo_name, data);
    // Create issue in database and assign github_issue_number to associate back
    Ticket.findOne({
        attributes: ['id', 'title', 'description', 'issue_id'],
        where: {
            id: req.body.ticket_id
        }
    })
        .then(ticketData => {
            // We want to prevent the user from creating an issue if the issue_id is not null for this ticket
            if (ticketData.issue_id !== null) {
                res.status(400).json({ message: 'Issue already exists for this ticket' });
                return;
            }
            Project.findOne({
                where: {
                    id: req.body.project_id
                }
            })
                .then(projectDetails => {
                    // Create data to send to GitHub for issue creation based on ticket data
                    data = {
                        "title": ticketData.title,
                        "body": ticketData.description,
                        "state": "open"
                    };
                    // Create Issue in GitHub from ticketData and get back issue number
                    createIssue(projectDetails.github_username, projectDetails.github_repo_name, data)
                        .then(githubResult => {
                            // Create Issue database
                            console.log("-=-==-=-=-CREATING ISSUE=-=-=-=-=-");
                            Issue.create({
                                due_date: req.body.due_date,
                                priority: req.body.priority,
                                github_issue_number: githubResult.number,
                                project_id: req.body.project_id
                            })
                                .then(issueData => {
                                    Ticket.update({
                                        issue_id: issueData.id
                                    },
                                        {
                                            where: {
                                                id: ticketData.id
                                            }
                                        })
                                        .then(ticketDataUpdate => res.json(issueData))
                                        .catch(err => {
                                            console.log(err);
                                            res.status(500).json(err);
                                        });
                                })
                                .catch(err => {
                                    console.log(err);
                                    res.status(500).json(err);
                                });
                        });
                })
                .catch(err => {
                    console.log(err);
                    res.status(500).json(err);
                })
        });
});


// Update Issue - /api/issue/:id
router.put('/:id', withAuth, async (req, res) => {
    // Look up project details to grab github_username and github_repo_name
    const projectDetails = await Project.findOne({
        where: {
            id: req.body.project_id
        }
    })
        .then(projectData => {
            if (!projectData) {
                res.status(404).json({ message: 'No project found with the provided id' });
                return;
            }
            return projectData;
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
            return;
        });
    // Update Issue in Database - TODO: Fix hard coded issue ID
    const closingIssue = (req.body.issueState_id && req.body.issueState_id === 4) ? true : false;
    Issue.update(
        {
            due_date: req.body.due_date,
            priority: req.body.priority,
            github_issue_number: req.body.github_issue_number,
            issue_state_id: req.body.issueState_id,
            project_id: req.body.project_id
        },
        {
            where: {
                id: req.params.id
            }
        }
    )
        .then(async issueData => {
            if (!issueData) {
                res.status(404).json({ message: 'No issue found with this id' });
                return;
            }

            // If issue is being closed, notify anyone who may have opened a ticket related to this issue
            if (closingIssue) {
                Ticket.findAll({
                    where: {
                        issue_id: req.params.id
                    }
                }).
                    then(ticketData => {
                        for (let i = 0; i < ticketData.length; i++) {
                            // Send email to client if email exists
                            if (ticketData[i].email || ticketData[i].phone) {
                                sendNotification(ticketData[i].phone, ticketData[i].email, `TICKET CLOSED: ${ticketData[i].title}`, ticketData[i].description, '', '')
                                    .then(emailResponse => console.log(emailResponse));
                            }
                        }
                    });
            }
            // If data was provided, update GitHub issue
            if (typeof req.body.data != "undefined") {
                let issueNumber = '';

                // Check if issue number was provided or lookup is needed
                if (!req.body.github_issue_number) {
                    // Find issue again for needed values not provided by req.body
                    const updatedIssueData = await Issue.findOne({
                        where: {
                            id: req.params.id
                        }
                    })
                        .then(updatedData => {
                            if (!updatedData) {
                                res.status(404).json({ message: 'There was an issue getting the updated issue by id' });
                                return;
                            }
                            return updatedData;
                        })
                        .catch(err => res.status(500).json(err));

                    // Use either provided github_issue_number or 
                    issueNumber = updatedIssueData.dataValues.github_issue_number;
                } else {
                    // Use either provided github_issue_number or 
                    issueNumber = req.body.github_issue_number;
                }

                // Update issue on GitHub
                if (issueNumber && projectDetails.github_username && projectDetails.github_repo_name) {
                    const githubResult = await updateIssue(projectDetails.github_username, projectDetails.github_repo_name, parseInt(issueNumber), req.body.data);
                }
            }

            res.json(issueData);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});


module.exports = router;