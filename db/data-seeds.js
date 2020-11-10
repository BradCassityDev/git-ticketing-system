const { User, Issue, Issue_User, Project, Team } = require('../models');
const bcrypt = require('bcrypt');

const sequelize = require('../config/connection');
const adminPassword = bcrypt.hashSync(process.env.adminPassword, 10)

const userData = [
  {
    username: 'heather-everton',
    email: 'heathereverton88@gmail.com',
    phone: '18015556677',
    password: adminPassword,
    role_id: 1,
    user_state_id: 1,
    team_id: 1
  },
  {
    username: 'BradCassityDev',
    email: 'bradley.cassity@gmail.com',
    phone: '18012223344',
    password: adminPassword,
    role_id: 1,
    user_state_id: 1,
    team_id: 1
  },
  {
    username: 'jesseparent',
    email: 'jesseparent@gmail.com',
    phone: '18015604507',
    password: adminPassword,
    role_id: 1,
    user_state_id: 1,
    team_id: 1
  },
  {
    username: 'jrogerson20',
    email: 'jaredrogerson@rocketmail.com',
    phone: '18011112233',
    password: adminPassword,
    role_id: 1,
    user_state_id: 1,
    team_id: 1
  },
  {
    username: 'LaurieGraff',
    email: 'laurie.m.graff@gmail.com',
    phone: '18019998855',
    password: adminPassword,
    role_id: 1,
    user_state_id: 1,
    team_id: 1
  }
];

const teamData = [
  {
    name: 'Autobots'
  },
  {
    name: 'Decepticons'
  },
  {
    name: 'Defenders'
  },
  {
    name: 'Avengers'
  }
]

const projectData = [
  {
    name: 'Bell',
    github_repo_name: 'professional-softphone',
    github_username: 'RealSuperDev',
    team_id: 1,
    project_state_id: 1
  },
  {
    name: 'Hermes',
    github_repo_name: 'email-client',
    github_username: 'RealSuperDev',
    team_id: 2,
    project_state_id: 1
  },
  {
    name: 'Smiley Face',
    github_repo_name: 'customer-relationship-manager',
    github_username: 'RealSuperDev',
    team_id: 3,
    project_state_id: 1
  }
]

const issueData = [
  {
    due_date: '11-28-2020',
    priority: 'Medium',
    github_issue_number: 1,
    issue_state_id: 1,
    project_id: 1
  },
  {
    due_date: '11-08-2020',
    priority: 'High',
    github_issue_number: 1,
    issue_state_id: 1,
    project_id: 2
  },
  {
    due_date: '11-18-2020',
    priority: 'Low',
    github_issue_number: 1,
    issue_state_id: 1,
    project_id: 3
  },
  {
    due_date: '11-18-2020',
    priority: 'Low',
    github_issue_number: 2,
    issue_state_id: 1,
    project_id: 1
  },
  {
    due_date: '11-18-2020',
    priority: 'Low',
    github_issue_number: 3,
    issue_state_id: 1,
    project_id: 1
  },
  {
    due_date: '11-18-2020',
    priority: 'Low',
    github_issue_number: 4,
    issue_state_id: 1,
    project_id: 1
  },
  {
    due_date: '11-16-2020',
    priority: 'Medium',
    github_issue_number: 2,
    issue_state_id: 1,
    project_id: 2
  },
  {
    due_date: '11-16-2020',
    priority: 'Medium',
    github_issue_number: 3,
    issue_state_id: 1,
    project_id: 2
  }
]

const issueUserData = [
  {
    issue_id: 1,
    user_id: 4
  },
  {
    issue_id: 2,
    user_id: 3
  },
  {
    issue_id: 3,
    user_id: 4
  },
  {
    issue_id: 4,
    user_id: 2
  },
  {
    issue_id: 5,
    user_id: 3
  },
  {
    issue_id: 6,
    user_id: 5
  },
  {
    issue_id: 7,
    user_id: 2
  },
  {
    issue_id: 8,
    user_id: 4
  }
]

sequelize
  .sync({ force: false })
  .then(() => {
    return Team.bulkCreate(teamData),
      Project.bulkCreate(projectData),
      User.bulkCreate(userData),
      Issue.bulkCreate(issueData),
      Issue_User.bulkCreate(issueUserData);
  })
  .then(seedData => {
    console.log("All data tables seeded successfully");
    process.exit(0);
  })
  .catch(err => {
    console.log(err);
    process.exit(1);
  });
