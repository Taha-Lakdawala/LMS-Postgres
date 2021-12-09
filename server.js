const express = require('express');
const app = express();
app.use(express.json());


// Config
require('dotenv').config();
PORT = process.env.PORT;

// DB config
const db = require('./config/db')

// Connect to DB
db.authenticate()
  .then(()=> console.log('Database Connected..'))
    .catch(err => {
      console.log('Error connecting database, exiting now...');
      console.log(err);
      process.exit(1);
    })

// Helper
const {CalculateFine}= require('./helper/CalculateFine');

// Routes
app.use(require("./routes/auth"));
app.use(require("./routes/admin"));
app.use(require("./routes/user"));
app.use(require("./routes/book"));

app.listen(PORT, CalculateFine(), () => {
  console.log('Server is running on ', PORT);
});