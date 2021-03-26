
//For mysql
//const connection = require('../models/database/databaseConfig');

//For sequelize
const connection = require('../models/User');
const User = require('../models/User');

module.exports.index_get = (req, res) => {
	const text = "users";
	res.render('index', { text: text})
}

module.exports.login_get = (req, res) => {

	/*
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
	*/

	if(req.query.username === undefined)
		res.render('login', {Error: ''});
	else{
		const user =  User.findOne({ where: { username: req.query.username } });
		if (user != req.query.username) //=== null
			res.render('login', {Error: 'Not Found.'}); 
		else {
			res.render('homepage', {username: req.query.username});
		}
	} 

}

module.exports.signup_get = (req, res) => {
	res.render('signup', { Error: ''});
}

module.exports.homepage_get = (req, res) => {
	var usn = req.query.username;
	res.render('homepage', {username: usn});
}

//link: https://www.esparkinfo.com/node-js-with-mysql-using-sequelize-express.html

module.exports.signup_post = (req, res) => {	
	//validate request
	if (!(req.body.username || req.body.email || req.body.password)){
		res.render('signup', {Error: 'Slot is empty. Try again'});
		return;
	}
	else{
		const user = {
			username: req.body.username,
			email: req.body.email,
			password: req.body.password,
		};

		User.create(user).then(data => {
			res.render('signup', {Error: 'Account was created successfully!'});
		}).catch(err => {
			res.render('signup', {Error: 'Try again.'})
		})
	}
}


module.exports.search_get = (req, res) => {
	res.render('search', {username: ''});
}

module.exports.profile_get = (req, res) => {
	res.render('profile', {username: ''});
}