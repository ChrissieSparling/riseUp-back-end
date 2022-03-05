const express = require('express');
const cors = require('cors');
require('dotenv').config();

const routes = require('./routes/api')
const sequelize = require('./config/config');

const app = express();
const PORT = process.env.PORT || 3005;


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

// need to add authorizations - express session