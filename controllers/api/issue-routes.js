const router = require('express').Router();
const {issueDetails, createIssue, updateIssue} = require('../../utils/github');
const {User, Issue, Project, Issue_State, Project_State, Issue_User} = require('../../models/index');

// Get all Issues - /api/issues
router.get('/', (req, res) => {
    Issue.findAll({
        include: [
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
                through: Issue_User,
                as: 'Assigned Users'
            }
        ]
    })
    .then(issueDate => res.json(issueDate))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

// Get Issue by ID - /api/issues/:id
router.get('/:id', (req, res) => {
    Issue.findOne({
        where: {
            id: req.params.id
        },
        include: [
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
                through: Issue_User,
                as: 'Assigned Users'
            }
        ]
    })
    .then(async issueData => {
        if (!issueData) {
            res.status(404).json({message: 'No issue found by that id'});
            return;
        }
        
        // Retrieve github issue details
        // const github_issue_number = issueData.github_issue_number;
        // const 
        // const githubIssueDetails = await issueDetails(githubUser, repoName, issueNum);


        res.json(issueDate);
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
        include: {
            
        }
    })
    .then(issueData => {
        if (!issueData) {
            res.status(404).json({message: 'No issues found with that user id'});
        }
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

// Get Issues related to Project - /api/issues/project/:id
router.get('/project/:id', (req, res) => {

});

// Update Issue - /api/issues/:id
router.put('/:id', (req, res) => {

});

// Create Issue - /api/issues
router.post('/', (req, res) => {

});

module.exports = router;