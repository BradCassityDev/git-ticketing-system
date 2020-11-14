const router = require('express').Router();
const { Issue, Project, Team, Project_State } = require('../../models');
const withAuth = require('../../utils/auth');
const withAuthAdmin = require('../../utils/authAdmin');
const { getRepoDetails, getRepoIssues, issueDetails, createIssue, updateIssue } = require('../../utils/github');
const { syncGithubIssues } = require('../../utils/sync-github-issues');

// GET - Get all projects - /api/project
router.get('/', withAuth, (req, res) => {
    Project.findAll({
        include: [
            {
                model: Project_State,
                attributes: ['name']
            },
            {
                model: Team,
            }
        ]
    })
        .then(projectData => res.json(projectData))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

// GET - Get single project - /api/project/:id
router.get('/:id', withAuth, (req, res) => {
    Project.findOne({
        where: {
            id: req.params.id
        }
    })
        .then(projectData => res.json(projectData))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

// GET - Sync Project Issues - /api/project/sync/:id
router.get('/sync/:id', withAuth, async (req, res) => {
    Project.findOne({
        where: {
            id: req.params.id
        },
        include: [
            {
                model: Issue
            }
        ]
    })
        .then(async projectData => {
            if (!projectData) {
                res.status(404).json({ message: 'No project found with that ID'} );
                return;
            }
            await syncGithubIssues(projectData)
                .then(data => {
                    res.json(data);
                });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

// POST - Create project - /api/project
router.post('/', withAuthAdmin, (req, res) => {
    Project.create({
        name: req.body.name,
        github_repo_name: req.body.github_repo_name,
        github_username: req.body.github_username,
        project_state_id: (req.body.project_state_id) ? req.body.project_state_id : 1,
        team_id: req.body.team_id
    })
        .then(projectData => {
            res.json(projectData);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

// UPDATE - update project - /api/project/:id
router.put('/:id', withAuthAdmin, (req, res) => {
    // create object to update project
    const updateProjectObj = {
        name: req.body.name,
        github_repo_name: req.body.github_repo_name,
        github_username: req.body.github_username,
        project_state_id: req.body.project_state_id
    }

    // Check if team_id exists and that it is greater than 0 and add to object
    if (parseInt(req.body.team_id) > 0) {
        updateProjectObj.team_id = req.body.team_id;
    }

    Project.update(
        updateProjectObj,
        {
            where: {
                id: req.params.id
            }
        }
    )
        .then(projectData => res.json(projectData))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

module.exports = router;