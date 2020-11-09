const router = require('express').Router();
const { Team } = require('../../models');
const withAuthAdmin = require('../../utils/authAdmin');

// CREATE
router.post('/', withAuthAdmin, (req, res) => {
    Team.create({
      name: req.body.name 
    })
      .then(dbTeamData => res.json(dbTeamData))
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
  });

// READ
router.get('/', withAuthAdmin, (req, res) => {
    Team.findAll()
        .then(dbTeamData => res.json(dbTeamData))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

router.get('/:id', withAuthAdmin, (req, res) => {
    Team.findOne({
        where: {
            id: req.params.id
        }
    })
        .then(dbTeamData => res.json(dbTeamData))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

// UPDATE
router.put('/:id', withAuthAdmin, (req, res) => {
    Team.update(
        {
            name: req.body.name,
        },
        {
            where: {
                id: req.params.id
            }
        }
    )
        .then(dbTeamData => res.json(dbTeamData))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

  module.exports = router;
