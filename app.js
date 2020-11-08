var hbs = require('express-handlebars');
// view engine setup
app.set('view engine', 'hbs');

app.engine( 'hbs', hbs( {
    extname: 'hbs',
    defaultView: 'default',
    layoutsDir: __dirname + '/views',
    partialsDir: `${__dirname}/views`
  }));