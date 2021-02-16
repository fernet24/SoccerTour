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

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

//set templating engine
app.set('view engine', 'ejs');
//app.set('views', './views')

//MySQL
const pool = mysql.createPool({
	connectionLimit : 10,
	host: 'localhost',
	user: 'root',
	password: '',
	database: 'soccertour_db',
	insecureAuth : true
});

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


//get values from account table
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
})






//stores passed data (middleware)
app.use(bodyParser.urlencoded({ extended: false}))
app.use(bodyParser.json())

//navigation
/*
app.get('', function(req, res){
	const text = "users";
	res.render('index', { text: text})

});
*/

app.get('/signup', function(req, res){
	res.render('signup');
});


app.get('/homepage', function(req, res){
	const username = req.query.username;
	res.render('homepage', {username: username});
});

/*
app.post('/homepage', function(req, res){
	const username = req.body.username;
	res.render('homepage', {username: username});
});
*/


//Listen on port 3000
app.listen(port, () => console.info('Listening on port ${port}'))
