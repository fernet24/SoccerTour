//dependencies
const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const app = express();
const session = require('express-session');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/authRoutes');
const port = 3000;

//Static files
app.use(express.static('public'))
app.use('/css', express.static(__dirname + 'public/css'))
app.use('/js', express.static(__dirname + 'public/js'))
app.use('/img', express.static(__dirname + 'public/img'))

//middleware 
app.use(express.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cookieParser());

//new
app.use(express.json());

app.use(session({
	secret: 'secret-key',
	resave: false,
	saveUninitialized: false,
}));


//view engine 
app.set('view engine', 'ejs');
app.set('views', './views');

app.use(authRoutes);

//start app
app.listen(port, () => console.info('Listening on port ' + port));
