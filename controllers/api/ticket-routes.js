const router = require('express').Router();
const { Ticket, Issue, Issue_State, Ticket_State, Project, User } = require('../../models');
const sendNotification = require('../../utils/email-notification');
const withAuth = require('../../utils/auth');
const withAuthAdmin = require('../../utils/authAdmin');

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

router.get('/', withAuth, (req, res) => {
  Ticket.findAll({
    include: includeArray
  })
    .then(dbTicketData => res.json(dbTicketData))
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.get('/:id', withAuth, (req, res) => {
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
    .then(dbTicketData => {
      // Email details of ticket to all admin users
      User.findAll({
        where: {
          role_id: 2 // TODO: May not want this hard coded
        }
      })
        .then(dbAdminUsers => {
          for (let i = 0; i < dbAdminUsers.length; i++) {
            // Send email to admin if email exists
            if (dbAdminUsers[i].email) {
              sendNotification(dbAdminUsers[i].phone, dbAdminUsers[i].email, `NEW TICKET: ${dbTicketData.title}`, dbTicketData.description, '', '')
                .then(emailResponse => console.log(emailResponse));
            }
          }
        });
      // Return results of ticket creation
      res.json(dbTicketData)
    })
    .catch(err => {
      console.log(err);
      res.status(400).json(err);
    });

});

router.put('/:id', withAuthAdmin, (req, res) => {
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

// Assign ticket to issue route - /api/ticket/issue/:id
router.put('/issue/:id', withAuthAdmin, (req, res) => {
  Ticket.update(
    {
      issue_id: req.body.issue_id
    },
    {
      where: {
        id: req.params.id
      }
    }
  )
    .then(ticketData => {
      if (!ticketData) {
        res.status(404).json({ message: 'No ticket found by that id.' });
        return;
      }

      res.json(ticketData);
    })
    .catch(err => {
      console.log(err);
      res.status(400).json(err);
    });
});

router.delete('/:id', withAuthAdmin, (req, res) => {
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