
//For mysql
//const connection = require('../models/database/databaseConfig');

//For sequelize
const connection = require('../models/user/User');
const User = require('../models/user/User');
const Group = require('../models/group/Group');
const Membership = require('../models/membership/Membership');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const JsonWebToken = require('./JWT/JsonWebToken');

const Group_HelperFunctions = require('../models/group/Group_HelperFunctions');

var groupName = 'undefined';
//var groupTitle = 'undefined';
var groupDate = 'undefined';
var groupTime = 'undefined';
var groupLocation = 'undefined';
var groupOrganizer = 'undefined';
var groupMembers = [];
var memberOf = [];
var memberOf_index = 0;

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
	try{
		res.render('homepage', {username: JsonWebToken.getUsername(req.cookies.soccer_secret)});
	}catch(err){
		res.render('homepage', {username: JsonWebToken.getUsername(req.cookies.soccer_secret)});
	}
}

module.exports.notification_get = (req, res) => {

	res.render('notification', {username: JsonWebToken.getUsername(req.cookies.soccer_secret)});
}

module.exports.groupInfo_get = async (req, res) => {

	var username = JsonWebToken.getUsername(req.cookies.soccer_secret);

	try{
		groupName = req.query.search;
		groupMembers = []; //9/24: ADDED

		console.log('Group Members: ' + groupMembers);
		console.log('Member of: ' + memberOf);
		
		console.log('search name: ' + groupName);

		//find all members from searched group
		var members = await Membership.findAll({
			where: {
				groupTitle: groupName
			}
		}).then(answer =>{
			console.log('LENGTH: ' + answer.length);
			if(answer.length != 0)
			{
				for(i = 0; i < answer.length; i++)
					groupMembers[i] = answer[i].username;
			}
			else{
				groupMembers = 0;
				console.log('zero members: ' + groupMembers);
			}

		}).catch(err =>{
			console.log('ERROR! GROUP TITLE DOES NOT EXIST!-> ' + err);
			res.render('homepage', {username: JsonWebToken.getUsername(req.cookies.soccer_secret)}); 
		})

		//find all groups of a user
		var group = await Group.findAll({ 
				where: { 
					title: groupName
				}
			}).then(answer =>{
				console.log('title: ' + answer[0].title);
				console.log('date: ' + answer[0].date);
				console.log('time: ' + answer[0].time);
				console.log('location: ' + answer[0].location);
				console.log('organizer: ' + answer[0].organizer);

				groupTitle = answer[0].title;
				groupDate = answer[0].date;
				groupTime = answer[0].time;
				groupLocation = answer[0].location;
				groupOrganizer = answer[0].organizer;

				if(groupMembers == 0)
					res.render('groupInfo', {username: JsonWebToken.getUsername(req.cookies.soccer_secret), title: groupName, date: answer[0].date, time: answer[0].time, location: answer[0].location, organizer: answer[0].organizer, members: 'NONE', Error: ''});
				else
					res.render('groupInfo', {username: JsonWebToken.getUsername(req.cookies.soccer_secret), title: groupName, date: answer[0].date, time: answer[0].time, location: answer[0].location, organizer: answer[0].organizer, members: groupMembers, Error: ''});

		
			}).catch(err =>{
				console.log('GROUPINFO FUNCTION ERROR---> ' + err);
				res.render('group', {username: JsonWebToken.getUsername(request), firstGroup: '[ERROR]', secondGroup: '', Error: ''});
			})


	}catch(err){
		console.log('ERROR: USER SUBMITTED A BLANK FORM!');
		res.render('homepage', {username: JsonWebToken.getUsername(req.cookies.soccer_secret)});
	}

}

module.exports.groupInfo_post = (req, res) => { //async

	var username = JsonWebToken.getUsername(req.cookies.soccer_secret);

	//var groupMembers = [];
	console.log('Group Members (inside groupInfo_post): ' + groupMembers);
	
	if(username == groupOrganizer){
		res.render('groupInfo', {username: JsonWebToken.getUsername(req.cookies.soccer_secret), title: groupName, date: groupDate, time: groupTime, location: groupLocation, organizer: groupOrganizer, members: groupMembers, Error: 'UNABLE TO JOIN. YOU ARE THE ORGANIZER.'});
	}
	//checks if user is registered in the group
	else if(memberOf.indexOf(username) !== 1){
		res.render('groupInfo', {username: JsonWebToken.getUsername(req.cookies.soccer_secret), title: groupName, date: groupDate, time: groupTime, location: groupLocation, organizer: groupOrganizer, members: groupMembers, Error: 'YOU ARE A MEMBER ALREADY AMIGO!'});
	} 
	else{
		connection.sync({

		}).then(async function(){

			var member = {
				username: username,
				groupTitle: groupName,
			};

			Membership.create(member).then(data => {
				memberOf[memberOf_index] = groupName;
				memberOf_index++;
				res.render('groupInfo', {username: JsonWebToken.getUsername(req.cookies.soccer_secret), title: groupName, date: groupDate, time: groupTime, location: groupLocation, organizer: groupOrganizer, members: groupMembers, Error: 'JOINED!'});
			}).catch(err => {
				console.log('JOINING ERROR: ' + err);
				res.render('groupInfo', {username: JsonWebToken.getUsername(req.cookies.soccer_secret), title: groupName, date: groupDate, time: groupTime, location: groupLocation, organizer: groupOrganizer, members: groupMembers, Error: 'YOU ARE A MEMBER ALREADY!'});
			})
		})
	}
}

module.exports.group_get = (req, res) => { //async

	try{
		Group_HelperFunctions.printGroups(req, res, Membership, memberOf); 
	}catch(err){
		console.log('INSIDE GROUP_GET---> '+ err);
	}
}

module.exports.group_post = (req, res) => {

	var request = req.cookies.soccer_secret;

	//validate request
	if (!(req.body.title || req.body.date || req.body.time || req.body.location)){
		res.render('group', {username: JsonWebToken.getUsername(request), firstGroup: '', secondGroup: '', Error: 'Slot is empty. Try again.'});
		return;
	}
	else{
		
		connection.sync({
			//force: true //forces to delete all values from table
		}).then(async function(){
			
			var result = Group_HelperFunctions.getNumberOfGroups(request).then(function(totalGroups){ 
				
				console.log('VALUE---> ' + totalGroups);

				//'FIX HERE'
				if(totalGroups > 2){
					Group_HelperFunctions.printGroups(req, res);
				}
				else {
					//group object
					var group = {
						title: req.body.title,
						date: req.body.date,
						time: req.body.time,
						location: req.body.location,
						organizer: JsonWebToken.getUsername(request),
					};

					Group.create(group).then(data => {
						Group_HelperFunctions.printGroups(req, res);
					}).catch(err => {
						res.render('group', {username: JsonWebToken.getUsername(request), firstGroup: '', secondGroup: '', myGroups: 'In-progress...' , Error: 'Try again.'});
						console.log(err);
					}) 
				}
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



