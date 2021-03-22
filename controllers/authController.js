
//For mysql
const connection = require('../models/database/databaseConfig');

//For sequelize
//const connect_UserModel = require('../models/database/User');
//const connect_GroupModel = require('../models/database/Group');


module.exports.index_get = (req, res) => {
	const text = "users";
	res.render('index', { text: text})
}

module.exports.login_get = (req, res) => {
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
}

module.exports.signup_get = (req, res) => {
	res.render('signup', { Error: ''});
}

module.exports.homepage_get = (req, res) => {
	var usn = req.query.username;
	res.render('homepage', {username: usn});
}

module.exports.homepage_post = (req, res) => {
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
}


module.exports.search_get = (req, res) => {
	res.render('search', {username: ''});
}

module.exports.profile_get = (req, res) => {
	res.render('profile', {username: ''});
}