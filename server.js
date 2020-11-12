const express = require('express');
const sequelize = require('./config/connection');
const exphbs = require('express-handlebars');
const app = express();
const session = require('express-session');
const path = require('path');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const helpers = require('./utils/helpers');


const sess = {
  secret: 'Super secret secret',
  cookie: { maxAge: 1000 * 60 * 60 },//1 hour
  resave: false,
  saveUninitialized: true,
  store: new SequelizeStore({
    db: sequelize,
  })
};

app.use(session(sess));

const hbs = exphbs.create({helpers});

//template engine
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

// Port
const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
// Routes
app.use(require('./controllers'));
const db = require('./models/index');

// Start server on specified port after successful connection to database
sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
  });
});