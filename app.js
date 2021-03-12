
//import dependencies
const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const app = express();
const session = require('express-session');
const jwt = require('jsonwebtoken');
const port = 3000;

//Static files
app.use(express.static('public'))
app.use('/css', express.static(__dirname + 'public/css'))
app.use('/js', express.static(__dirname + 'public/js'))
app.use('/img', express.static(__dirname + 'public/img'))

//middleware for controllers
app.use(express.urlencoded({extended: true}));
app.use(bodyParser.json());

//new
app.use(express.json());

app.use(session({
	secret: 'secret-key',
	resave: false,
	saveUninitialized: false,
}));


//set templating engine 
app.set('view engine', 'ejs');
app.set('views', './views')

//MySQL
const connection = mysql.createConnection({
	connectionLimit : 10,
	host: 'localhost',
	user: 'root',
	password: '',
	database: 'soccertour',
	insecureAuth : true
});

connection.connect(function(err){
	if(err) throw err;

	console.log('Connected...');
});

sessionData = "";

//Home route
app.get('', function(req, res, next){
	const text = "users";
	res.render('index', { text: text})
});

app.get('/login', auth, function(req, res){

	if(req.query.username === undefined)
		res.render('login', { Error: ''});
	else{
		var usn = req.query.username;
		var sql = "SELECT username, password FROM client WHERE username = ?";

		connection.query(sql, [usn], function(err, rows, fields){
			if(err) throw err

			if(rows.length === 0)
				res.render('login', {Error: 'Incorrect. Try again.'});
			else
				res.render('homepage', {username: rows[0].username});
		})
	}
});


app.get('/signup', function(req, res){
	res.render('signup', { Error: ''});
});

app.get('/homepage', inSession, function(req, res){

	var usn = req.query.username;
	res.render('homepage', {username: usn});
});


//Create record
app.post('/homepage', function(req, res){

	var email = req.body.email;
	var username = req.body.username;
	var password = req.body.password;

	var exist_db = "SELECT email FROM client WHERE EXISTS(SELECT email = ?)";

	connection.query(exist_db, [email], function(err, rows){
		if(err) throw err;

		var exist_flag = false;

		//BIG O(N)***
		for(i = 0; i < rows.length; i++)
		{
			if(rows[i].email === email)
			{
				res.render('signup', { Error: 'Account Exist Already.'});
				exist_flag = true;
			}
		}

		if(!exist_flag)
		{
			var insert_db = "INSERT INTO client VALUES('" + username + "', '"+ email + "', '" + password + "')"

			connection.query(insert_db, function(err){
				if(err) throw err;

				console.log('Posted successfully!');
				res.render('homepage', {username: username});
			});
		}
	});

});

app.get('/search', function(req, res){
	
	res.render('search', {username: ''});
});

app.get('/profile', function(req, res){
	
	res.render('profile', {username: ''});
});

//middleware functions
function auth(req, res, next){
	console.log('login testing');
	next();
}

function inSession(req, res, next){
	console.log(req.query.username);
	next();
}



//start app
app.listen(port, () => console.info('Listening on port ' + port))

