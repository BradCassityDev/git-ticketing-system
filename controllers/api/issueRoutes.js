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
// May want to have in userRoutes
router.get('/user/:id', (req, res) => {
    Issue.findAll({
        where: {
            id: req.params.id
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