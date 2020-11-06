const router = require('express').Router();
const {User, Issue, Project, Role, Team, User_State, Issue_State, Project_State, Issue_User} = require('../../models');

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
router.get('/:id', (req, res) => {
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
        github_username: req.body.github_username
    })
    .then(projectData => res.json(projectData))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

// Update project - /api/project/:id
router.put('/:id', (req, res) => {
    Project.update(
        {
            name: req.body.name,
            github_repo_name: req.body.github_repo_name,
            github_username: req.body.github_username
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

// Delete project - /api/project/:id
router.delete('/:id', (req, res) => {
    Project.destroy({
        where: {
            id: req.params.id
        }
    })
    .then(projectData => {
        if (!projectData) {
            res.status(404).json({message: 'No project found by this id'});
            return;
        }
        res.json(projectData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

module.exports = router;