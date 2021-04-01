
//For mysql
//const connection = require('../models/database/databaseConfig');

//For sequelize
const connection = require('../models/User');
const User = require('../models/User');
const bycrypt = require('bcryptjs');

module.exports.index_get = (req, res) => {
	const text = "users";
	res.render('index', { text: text})
}

module.exports.login_get = async (req, res) => {

	if(req.query.username === undefined)
		res.render('login', {Error: ''});
	else{
		try{
			const user = await User.findOne({ where: { username: req.query.username } });
		
			if (user.username === req.query.username && user.password === req.query.password) 
				res.render('homepage', {username: req.query.username}); 
			
		}catch(e){
			res.render('login', {Error: 'Sorry. Try again.'});
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
		
		connection.sync({
			//force: true //forces to delete all values from table
		}).then(async function(){

			//hash password
			const saltRounds = 10;
			const salt = await bycrypt.genSaltSync(saltRounds);
			const hash = await bycrypt.hashSync(req.body.password, salt);
			
			const user = {
				username: req.body.username,
				email: req.body.email,
				password: hash,
			};

			User.create(user).then(data => {
				res.render('signup', {Error: 'Account was created successfully!'});
			}).catch(err => {
				res.render('signup', {Error: 'Try again.'})
			})
		})
	}
}


module.exports.search_get = (req, res) => {
	res.render('search', {username: ''});
}

module.exports.profile_get = (req, res) => {
	res.render('profile', {username: ''});
}