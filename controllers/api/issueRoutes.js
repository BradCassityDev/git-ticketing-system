const router = require('express').Router();
const {getRepoDetails, getRepoIssues, issueDetails, createIssue, updateIssue} = require('../../utils/github');
const {User, Issue, Project, Role, Team, User_State, Issue_State, Project_State, Issue_User} = require('../../models/index');

// Get all Issues - /api/issues
router.get('/', (req, res) => {
    Issue.findAll({
        include: [
            {
                model: Project
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
    .then(issueData => {
        if (!issueData) {
            res.status(404).json({message: 'No issue found by that id'});
            return;
        }
        res.json(issueDate);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

// Get Issues assigned to User - /api/issues/user/:id
router.get('/user/:id', (req, res) => {

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