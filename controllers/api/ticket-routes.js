const router = require('express').Router();
const { Ticket, Issue, Ticket_State, Project } = require('../../models');

router.get('/', (req, res) => {
  Ticket.findAll({
    include: [
      {
        model: Ticket_State,
        attributes: ['name']
      },
      {
        model: Issue,
        attributes: ['github_issue_number'],
        include: {
          model: Project,
          attributes: ['name']
        }
      }
    ]
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

module.exports = router;