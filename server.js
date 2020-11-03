const express = require('express');
const sequelize = require('./config/connection');

const app = express();

// Port
const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use(require('./routes'));

// Start server on specified port after successful connection to database
sequelize.sync({force: true}).then(() => {
  app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
  });
});