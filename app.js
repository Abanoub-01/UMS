require('dotenv').config();
const mongoose = require('mongoose')

const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const methodOverride = require('method-override') ;
const session = require('express-session');
const connectDB = require('./server/config/db.js');
const app = express();
const port = process.env.PORT || 3000;

// Connect to the database
connectDB();

// Template engine 
app.use(expressLayouts);
app.set('layout', './layouts/main');
app.set('view engine', 'ejs');

//helps use to grab the data from the form in api
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(methodOverride('_method'));

// Static files
app.use(express.static('public'));

//flash messages  and express session
const flash = require('connect-flash');
app.use(
  session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7, //one week
    },
  })
);
app.use(flash());

// Routes
app.use('/', require('./server/routes/customers'));

// Handle 404 error page not found 
app.get('*', (req, res) => {
  res.status(404).render("404");
});


mongoose.connection.once("open", () => {

  console.log("Connceted to the DB")

  app.listen(port, () => {
    console.log(`app listening on port ${port}`);
  })
})



/*userName: university 
pass: 5Y29bVRLAiHmxI9z */