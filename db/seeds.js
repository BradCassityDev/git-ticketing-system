const User_State = require('../models/User_State');
const Issue_State = require('../models/Issue_State');
const Project_State = require('../models/Project_State');
const Role = require('../models/Role');
const Ticket_State = require('../models/Ticket_State');
const User = require('../models/User');
const bcrypt = require('bcrypt');

const sequelize = require('../config/connection');
// const env = require('../.env')
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
const userData = [
  
  {
    username: 'test-user',
    email: 'test@user.com',
    phone: '1234567890',
    password: adminPassword,
    Role_id: 2,
    User_state_id: 1
  }
]
  

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
