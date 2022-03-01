// const path = require('path');
const express = require('express');
const session = require('express-session');
const cors = require('cors');
const bodyParser = require('body-parser')
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3005;
const routes = require('./routes/api')
const sequelize = require('./config/config');
const SequelizeStore = require('connect-session-sequelize')(session.Store);

const sess = {
  secret: process.env.SESSION_SECRET,
  cookie: {},
  resave: false,
  saveUninitialized: true,
  store: new SequelizeStore({
    db: sequelize
  })
};

app.use(session(sess));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.use(routes);

sequelize.sync({ force: false }).then(()=>{
  app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}!`);
  });
})

module.exports = app;