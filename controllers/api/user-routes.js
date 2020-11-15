const router = require('express').Router();
const { Op } = require("sequelize");
const { User } = require('../../models');
const withAuth = require('../../utils/auth');
const withAuthAdmin = require('../../utils/authAdmin');
const sequelize = require('../../config/connection');

// GET /api/users
router.get('/', withAuth, (req, res) => {
  // Access our User model and run .findAll() method)
  User.findAll({})
    .then(dbUserData => res.json(dbUserData))
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.get('/:id', withAuth, (req, res) => {
  User.findOne({
    where: {
      id: req.params.id
    }
  })
    .then(dbUserData => res.json(dbUserData))
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

// POST /api/users
router.post('/', withAuthAdmin, (req, res) => {
  // expects {username: 'Lernantino', email: 'lernantino@gmail.com', phone, '1234567890', password: 'password1234'}
  User.create({
    username: req.body.username,
    email: req.body.email,
    phone: req.body.phone,
    password: req.body.password,
    //add if statement to detect null value of user_state if null set it to 2(inactive) if not null set it to what it came in as.
    user_state_id: (req.body.user_state_id) ? req.body.user_state_id : 2,
    //default role as developer
    role_id: (req.body.role_id) ? req.body.role_id : 1,
    team_id: req.body.team_id
  })
    .then(dbUserData => res.json(dbUserData))
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.post('/login', (req, res) => {
  User.findOne({
    where: {
      username: req.body.username
    }
  })
    .then(dbUserData => {
      // checks for a matching email
      if (!dbUserData) {
        res.status(400).json({ message: 'No user with that username!' });
        return;
      };

      // checks that given password matches the hashed password in the db
      const validPassword = dbUserData.checkPassword(req.body.password);
      if (!validPassword) {
        res.status(400).json({ message: 'Incorrect password!' });
        return;
      };

      // Don't let inactive users log in
      if (dbUserData.user_state_id === 2) {
        res.status(400).json({ message: 'User is inactive!' });
        return;
      }

      req.session.save(() => {
        // declare session variables
        req.session.user_id = dbUserData.id;
        req.session.username = dbUserData.username;
        req.session.role_id = dbUserData.role_id;
        req.session.loggedIn = true;
        if (dbUserData.role_id === 2) { // admin
          res.redirect('/admin');
        }
        else { // null or developer
          res.redirect('/dashboard');
        }
      })
    });
});

router.post('/logout', (req, res) => {
  if (req.session.loggedIn) {
    req.session.destroy(() => {
      res.status(204).end();
    });
  }
  else {
    res.status(404).end();
  }

});

// PUT /api/user/1
router.put('/:id', withAuthAdmin, (req, res) => {
  User.update(req.body, {
    where: {
      id: req.params.id
    }
  })
    .then(dbUserData => {
      if (!dbUserData[0]) {
        res.status(404).json({ message: 'No user found with this id' });
        return;
      }

      const userState = parseInt(req.body.user_state_id);
      if (userState === 2) { // User was set to inactive state
        // Delete the session which will log out the user
        const deleteUserSQL = `DELETE FROM Session WHERE data LIKE '%"user_id":${req.params.id},%'`;
        sequelize.query(deleteUserSQL);
      }

      const userRole = parseInt(req.body.role_id);
      if (userRole === 1) { // User is set to developer role
        // Find a session object for this user with the opposite role
        const { QueryTypes } = require('sequelize');
        const findSessionSQL = `SELECT * FROM Session WHERE data LIKE '%"user_id":${req.params.id},%"role_id":2%'`;
        sequelize.query(findSessionSQL, { type: QueryTypes.SELECT })
          .then(sessionData => {
            // If we find a session, that means we should change the role in the session
            if (sessionData.length) {
              sessionData[0].data = sessionData[0].data.replace('"role_id":2,', '"role_id":1,');
              const replaceRoleSQL = `UPDATE Session SET data = '${sessionData[0].data}' WHERE sid='${sessionData[0].sid}'`;
              sequelize.query(replaceRoleSQL);
            }
          });
      }
      else if (userRole === 2) { // user is set to admin role
        // Find a session object for this user with the opposite role
        const { QueryTypes } = require('sequelize');
        const findSessionSQL = `SELECT * FROM Session WHERE data LIKE '%"user_id":${req.params.id},%"role_id":1%'`;
        sequelize.query(findSessionSQL, { type: QueryTypes.SELECT })
          .then(sessionData => {
            // If we find a session, that means we should change the role in the session
            if (sessionData.length) {
              sessionData[0].data = sessionData[0].data.replace('"role_id":1,', '"role_id":2,');
              const replaceRoleSQL = `UPDATE Session SET data = '${sessionData[0].data}' WHERE sid='${sessionData[0].sid}'`;
              sequelize.query(replaceRoleSQL);
            }
          });
      }
      res.json(dbUserData);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

// PUT /api/user/pw/1
router.put('/pw/:id', (req, res) => {
  User.update(req.body, {
    individualHooks: true,
    where: {
      id: req.params.id
    }
  })
    .then(dbUserData => {
      if (!dbUserData) {
        res.status(404).json({ message: 'No user found with this id' });
        return;
      }
      res.json(dbUserData);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

module.exports = router;
