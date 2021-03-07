
//import dependencies
const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql')
const app = express();
const port = 3000

//Static files
app.use(express.static('public'))
app.use('/css', express.static(__dirname + 'public/css'))
app.use('/js', express.static(__dirname + 'public/js'))
app.use('/img', express.static(__dirname + 'public/img'))

//app.use(bodyParser.urlencoded({extended: false}))
app.use(express.urlencoded({extended: true}));
app.use(bodyParser.json())


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

//Home route
app.get('', function(req, res){
	const text = "users";
	res.render('index', { text: text})

});

app.get('/login', function(req, res){
	res.render('login', { Error: ''});
});


app.get('/signup', function(req, res){
	res.render('signup', { Error: ''});
});

app.get('/homepage', function(req, res){

	var usn = req.query.username;
	var sql = "SELECT username, password FROM client WHERE username = ?";

	connection.query(sql, [usn], function(err, rows, fields){
		if(err) throw err

		if(rows.length === 0)
			res.render('login', {Error: 'Incorrect. Try again.'});
		else
			res.render('homepage', {username: rows[0].username});
		
	})
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
		console.log('outside for-loop: ' + exist_flag);

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

app.get('/search', function(res, res){
	res.render('search');
});

app.get('/profile', function(res, res){
	res.render('profile');
});

//start app
app.listen(port, () => console.info('Listening on port ' + port))


/*
app.get('/homepage', function(req, res){
	const username = req.query.username;
	res.render('homepage', {username: username});
});
*/

/*
//create a record
app.post('', (req, res)=>{
	pool.getConnection((err, connection)=>{
		if(err) throw err
		console.log('connected as id ${connection.threadId}')

		const params = req.body

		connection.query('INSERT INTO account SET ?', params, (err, rows)=>{
			connection.release()

			if(!err){
				res.send('Account with the record username: ${params.id} has been added.')
			}else{
				console.log(err)
			}
		})

		console.log(req.body)
	})
})
*/


//Home route
/*
app.get('', (req, res)=>{
	pool.getConnection((err, connection)=>{
		if(err) throw err
		console.log('connected as id ${connection.threadId}')

		connection.query('SELECT * FROM account', (err, rows)=>{
			connection.release()

			if(!err){

				res.send(rows)
				//const text = rows;
				//res.render('index', {text: text})
			}else{
				console.log(err)
			}
		})
	})
}) */