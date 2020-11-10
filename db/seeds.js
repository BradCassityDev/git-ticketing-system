const { User_State, Issue_State, Project_State, Role, Ticket_State, User } = require('../models/');
const bcrypt = require('bcrypt');

const sequelize = require('../config/connection');
const adminPassword = bcrypt.hashSync(process.env.adminPassword, 10)


const userStateData = [
  {
    name: 'Active',
  },
  {
    name: 'Inactive',
  }
]
const issueStateData = [
  {
    name: 'Opened',
  },
  {
    name: 'In Progress',
  },
  {
    name: 'Blocked',
  },
  {
    name: 'Closed',
  }
]
const projectStateData = [
  {
    name: 'Active',
  },
  {
    name: 'Inactive',
  }
]
const roleData = [
  {
    name: 'Developer',
  },
  {
    name: 'Admin',
  }
]
const ticketStateData = [
  {
    name: 'Opened',
  },
  {
    name: 'Issue Created',
  },
  {
    name: 'Issue Resolved',
  },
  {
    name: 'Will Not Address',
  },
  {
    name: 'Unable to Reproduce',
  }
]
const userData = [{
  username: 'test-user',
  email: 'test@user.com',
  phone: '1234567890',
  password: adminPassword,
  role_id: 2,
  user_state_id: 1
}];


sequelize
  .sync({ force: false })
  .then(() => {
    return User_State.bulkCreate(userStateData),
      Issue_State.bulkCreate(issueStateData),
      Project_State.bulkCreate(projectStateData),
      Role.bulkCreate(roleData),
      Ticket_State.bulkCreate(ticketStateData),
      User.bulkCreate(userData);
  })
  .then(seedData => {
    console.log("All tables seeded successfully");
    process.exit(0);
  })
  .catch(err => {
    console.log(err);
    process.exit(1);
  });
