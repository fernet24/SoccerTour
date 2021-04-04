
//For mysql
//const connection = require('../models/database/databaseConfig');

//For sequelize
const connection = require('../models/User');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


module.exports.index_get = (req, res) => {
	const text = "users";
	res.render('index', { text: text})
}

module.exports.login_get = (req, res) => {
	res.render('login', {Error: ''});
}

module.exports.login_post = async (req, res) => {

	if(!(req.body.username || req.body.password)){
		res.render('login', {Error: 'Slot is vacant. Try again'});
		return;
	}
	else{
		try{
			const user = await User.findOne({ where: { username: req.body.username} });

			//JWT-IN-PROGRESS
			const token = createToken(user._id);
			res.cookie(req.body.username, token, {httpOnly: true, maxAge: maxAge * 1000});
			
			console.log('user id: ' + user._id);
			console.log('token: ' + token);

			if (user.username === req.body.username && (bcrypt.compareSync(req.body.password, user.password) === true)) 
				res.render('homepage', {username: req.body.username}); 
			else
				res.render('login', {Error: 'Invalid.'});
		}catch(e){
			res.render('login', {Error: 'Sorry. Try again.'});
		}
	}
}

module.exports.signup_get = (req, res) => {
	res.render('signup', { Error: ''});
}

module.exports.homepage_get = (req, res) => {
	res.render('homepage', {username: req.query.username});
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
			const salt = await bcrypt.genSaltSync(saltRounds);
			const hash = await bcrypt.hashSync(req.body.password, salt);
			
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
	res.render('search', {username: req.query.username});
}

module.exports.profile_get = (req, res) => {
	res.render('profile', {username: req.query.username});
}

const maxAge = 3 * 24 * 60 * 60; //3 days in seconds
const createToken = (id, username) =>{
	return jwt.sign( { id }, 'jwt', {
		expiresIn: maxAge
	});
}
