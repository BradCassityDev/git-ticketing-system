const router = require('express').Router();
const { Ticket, Issue, Issue_State, Ticket_State, Project } = require('../../models');

// set array for GET table joins so it can be reused and stay DRY
const includeArray = [
  {
    model: Ticket_State,
    attributes: ['name']
  },
  {
    model: Issue,
    attributes: ['github_issue_number', 'due_date', 'priority'],
    include: {
      model: Issue_State,
      attributes: ['name']
    },
    include: {
      model: Project,
      attributes: ['name', 'github_repo_name', 'github_username']
    }
  }
];

router.get('/', (req, res) => {
  Ticket.findAll({
    include: includeArray
  })
    .then(dbTicketData => res.json(dbTicketData))
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.get('/:id', (req, res) => {
  Ticket.findOne({
    where: {
      id: req.params.id
    },
    include: includeArray
  })
    .then(dbTicketData => res.json(dbTicketData))
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.post('/', (req, res) => {
  Ticket.create({
    title: req.body.title,
    description: req.body.description,
    email: req.body.email,
    phone: req.body.phone,
    ticket_state_id: 1
  })
    .then(dbTicketData => res.json(dbTicketData))
    .catch(err => {
      console.log(err);
      res.status(400).json(err);
    });

});

router.put('/:id', (req, res) => {
  Ticket.update({
    title: req.body.title,
    description: req.body.description,
    email: req.body.email,
    phone: req.body.phone,
    ticket_state_id: req.body.ticket_state_id
  },
    {
      where: {
        id: req.params.id
      }
    })
    .then(dbTicketData => res.json(dbTicketData))
    .catch(err => {
      console.log(err);
      res.status(400).json(err);
    });
});

router.delete('/:id', (req, res) => {
  Ticket.destroy({
    where: {
      id: req.params.id
    }
  })
    .then(dbTicketData => {
      if (!dbTicketData) {
        res.status(404).json({ message: 'No ticket found with this id' });
        return;
      }
      res.json(dbTicketData);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

module.exports = router;