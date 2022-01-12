require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');

const app = express();

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

//conect to the db
mongoose.connect('mongodb://localhost:27017/mySuperSecretDB', {useUnifiedTopology: true});

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

userSchema.plugin(passportLocalMongoose);

const User = new mongoose.model('User', userSchema);
passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get('/', (req, res) => {
    res.render('index');
}); 

app.get('/register', (req, res)=>{
    res.render('register');
});

app.post('/register', (req, res) => {
    User.register({username: req.body.username}, req.body.password, (error, user)=>{
        if(error){
            console.log(error);
            res.redirect('/register');
        } else {
            passport.authenticate('local')(req, res, ()=> {
                res.render('secrets');
            });
        }
    });
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.post('/login', (req, res) => {
    const user = new User({
        username: req.body.username,
        password: req.body.password
    });

    req.login(user, (error)=>{
        if(error){
            console.log(error);
            res.redirect('/login') ;
        } else {
            passport.authenticate('local')(req, res, ()=>{
                res.redirect('/secrets');
            });
        }
    })
});

app.get('/secrets', (req, res) => {
    if(req.isAuthenticated()){
        res.render('secrets');
    } else {
        res.redirect('/');
    }
});

app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

const port = 3000;

app.listen(port, () => {
    console.log(`Server is running on port ${port}.`);
});