
//For mysql
//const connection = require('../models/database/databaseConfig');

//For sequelize
const connection = require('../models/User');
const User = require('../models/User');
const Group = require('../models/Group');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JsonWebToken = require('./JWT/JsonWebToken');

module.exports.index_get = (req, res) => {
	res.render('index', { text: 'users'})
}

module.exports.login_get = (req, res) => {
	res.render('login', {Error: ''});
}

/* The following asynchronous function authenticates users by validating their username and password using a JWT */
module.exports.login_post = async (req, res) => {

	if(!(req.body.username || req.body.password)){
		res.render('login', {Error: 'Slot is vacant. Try again'});
	}
	else{
		try{
			//find user in db
			const user = await User.findOne({ where: { username: req.body.username} });

			//create json web token
			const token = JsonWebToken.createToken(user.username); 

			//store jwt within a cookie accompany with an expiration time/date
			res.cookie(JsonWebToken.getSecretName, token, {httpOnly: true, maxAge: JsonWebToken.maxAge * 1000});

			//validate username and password
			if (user.username === req.body.username && (bcrypt.compareSync(req.body.password, user.password) === true))
				res.render('homepage', {username: req.body.username});
			
		}catch(e){
			res.render('login', {Error: 'Sorry. Try again.'});
			console.log(e);
		}
	}
}

module.exports.signup_get = (req, res) => {
	res.render('signup', { Error: ''});
}

/*The following function creates and stores users into the database. It stores their username, email, & password. The password is hashed before its stored 
 into the database. */
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
			
			//user object
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

module.exports.homepage_get = (req, res) => {
	res.render('homepage', {username: JsonWebToken.getUsername(req.cookies.soccer_secret)});
}

module.exports.search_get = (req, res) => {
	res.render('search', {username: JsonWebToken.getUsername(req.cookies.soccer_secret)});
}

module.exports.group_get = async (req, res) => {

	try{
		//find user groups in db
		const group = await Group.findAll({ where: { organizer: JsonWebToken.getUsername(req.cookies.soccer_secret)} });

		res.render('group', {username: JsonWebToken.getUsername(req.cookies.soccer_secret), myGroups: group[0].title, Error: ''});

	}catch(err){
		res.render('group', {username: JsonWebToken.getUsername(req.cookies.soccer_secret), myGroups: '', Error: ''});
		console.log(err);
	}
}

module.exports.group_post = (req, res) => {

	//validate request
	if (!(req.body.title || req.body.date || req.body.time || req.body.location)){
		res.render('group', {username: JsonWebToken.getUsername(req.cookies.soccer_secret), myGroups: '', Error: 'Slot is empty. Try again.'});
		return;
	}
	else{
		
		connection.sync({
			//force: true //forces to delete all values from table
		}).then(async function(){
			
			/*
			if( getNumberOfGroups() > 2)
				res.render('group', {username: getUsername(req.cookies.soccer_secret), Error: 'Sorry. Limit has exceeded.'});
			*/

			//group object
			const group = {
				title: req.body.title,
				date: req.body.date,
				time: req.body.time,
				location: req.body.location,
				organizer: JsonWebToken.getUsername(req.cookies.soccer_secret),
				members: '',
			};

			Group.create(group).then(data => {
				res.render('group', {username: JsonWebToken.getUsername(req.cookies.soccer_secret), myGroups: '', Error: 'Group was created successfully!'});
			}).catch(err => {
				res.render('group', {username: JsonWebToken.getUsername(req.cookies.soccer_secret), myGroups: '', Error: 'Try again.'})
				console.log(err);
			})
		})
	}
}

module.exports.profile_get = (req, res) => {
	res.render('profile', {username: JsonWebToken.getUsername(req.cookies.soccer_secret)});
}

module.exports.logout_get = (req, res) => {

	//destroy user cookie along with json web token
	res.cookie('soccer_secret', '', { maxAge: 1});
	res.redirect('/');
} 




//************************JSON WEB TOKEN HELPER FUNCTIONS**********
/*
//maxAge determines the life span of a json web token in seconds. The following is 1 day in seconds.
const maxAge = 1 * 24 * 60 * 60; 

//createToken function creates & signs a json web token to later authenticate a user into their account

const createToken = (username, secretName) =>{
	return jwt.sign( { username }, getSecretName(), {
		expiresIn: maxAge
	});
}

//decodes json web token and returns username
const getUsername = (req) =>{
	const decoded = jwt.verify(req, getSecretName());
	return decoded.username;
}

//jwt secret [sensitive information]
const getSecretName = () =>{
	return 'soccer_secret';
}

//jwt cookie secret encoded [NOT IN USE]
const getCookieSecret = (req) =>{
	return req.cookie.soccer_secret;
}

*/

//************************DB HELPER FUNCTIONS**********************
//counts the number of groups a user oranizes
const getNumberOfGroups = async (req) =>{

	const g = await Group.findAndCountAll({ 
			where: {
				organizer: getUsername(req.cookies.soccer_secret)
			},
			limit: 2
		}).then(result => {
			return result.count;
		})
}

const printGroups = async (req) =>{

	//console.log("GROUP TITLE: " + group[0].title); //use array if using Group.findAll
	//console.log("GROUP TITLE: " + group.title); //use this if using Group.findOne
	const group = await Group.findAll({ where: { organizer: getUsername(req.cookies.soccer_secret)} });

	return group[0].title;
}

