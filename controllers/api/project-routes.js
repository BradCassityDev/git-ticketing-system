const router = require('express').Router();
const { Issue, Project, Team, Project_State } = require('../../models');
const withAuthAdmin = require('../../utils/authAdmin');

// GET all projects - /api/project
router.get('/', withAuthAdmin, (req, res) => {
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

// Get single project - /api/project/:id
router.get('/:id', withAuthAdmin, (req, res) => {
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
router.post('/', withAuthAdmin, (req, res) => {
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