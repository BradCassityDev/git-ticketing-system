// const User = require("./User");
// const Issue = require("./Issue");
// const Project = require("./Project");
// const Role = require("./Role");
const Team = require("./Team");
// const User_State = require("./User_State");
// const Issue_State = require("./Issue_State");
// const Project_State = require("./Project_State");
// const Issue_User = require("./Issue_User");
// const Ticket = require("./Ticket")
// const Ticket_State = require("./Ticket_State")


// // User Associations
// User_State.hasMany(User, {
//     foreignKey: 'userState_id'
// });
// User.belongsTo(User_State, {
//     foreignKey: 'userState_id',
// });

// Role.hasMany(User, {
//     foreignKey: 'role_id'
// });
// User.belongsTo(Role, {
//     foreignKey: 'role_id',
// });

// Team.hasMany(User, {
//     foreignKey: 'team_id'
// });
// User.belongsTo(Team, {
//     foreignKey: 'team_id',
// });

// // Issue Associations
// Issue_State.hasMany(Issue, {
//     foreignKey: 'issueState_id'
// });
// Issue.belongsTo(Issue_State, {
//     foreignKey: 'issueState_id',
// });

// Project.hasMany(Issue, {
//     foreignKey: 'project_id'
// });
// Issue.belongsTo(Project, {
//     foreignKey: 'project_id',
// });

// // Issue_User Associations
// User.belongsToMany(Issue, {
//     through: Issue_User,
//     foreignKey: 'user_id'
// });
// Issue.belongsToMany(User, {
//     through: Issue_User,
//     foreignKey: 'issue_id'
// });

// // Project Associations
// Project_State.hasMany(Project, {
//     foreignKey: 'projectState_id'
// });
// Project.belongsTo(Project_State, {
//     foreignKey: 'projectState_id',
// });

// Team.hasMany(Project, {
//     foreignKey: 'team_id'   
// });
// Project.belongsTo(Team, {
//     foreignKey: 'team_id',
// });





module.exports = {Team};

// module.exports = { User, Issue, Project, Role, Team, User_State, Issue_State, Project_State, Issue_User };
// module.exports = { User, Issue, Project, Role, Team, User_State, Issue_State, Project_State, Issue_User, Ticket, Ticket_State };