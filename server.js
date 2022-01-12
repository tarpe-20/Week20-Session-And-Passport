require('dotenv').config();
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const mainRoute = require('./routes/mainRoute');
require('./models/db');
const app = express();

 //connect to the db

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({extended: true}));

//initialize session
app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true
}));

//initialize passport
app.use(passport.initialize());
app.use(passport.session());


app.use(mainRoute);

const port = 3000;

app.listen(port, () => {
    console.log(`Server is running on port ${port}.`);
});