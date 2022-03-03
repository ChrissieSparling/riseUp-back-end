const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3005;
const routes = require('./routes/api')
const sequelize = require('./config/config');

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