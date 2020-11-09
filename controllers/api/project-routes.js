const router = require('express').Router();
const { Issue, Project, Team, Project_State } = require('../../models');
const withAuth = require('../../utils/auth');

// GET all projects - /api/project
router.get('/', (req, res) => {
    Project.findAll()
        .then(projectData => res.json(projectData))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

// Get single project - /api/project/:id
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

// Create project - /api/project
router.post('/', (req, res) => {
    Project.create({
        name: req.body.name,
        github_repo_name: req.body.github_repo_name,
        github_username: req.body.github_username,
        project_state_id: (req.body.project_state_id) ? req.body.project_state_id : 1,
        team_id: req.body.team_id
    })
        .then(projectData => res.json(projectData))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

// Update project - /api/project/:id
router.put('/:id', withAuth, (req, res) => {
    Project.update(
        {
            name: req.body.name,
            github_repo_name: req.body.github_repo_name,
            github_username: req.body.github_username,
            project_state_id: req.body.project_state_id,
            team_id: req.body.team_id
        },
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