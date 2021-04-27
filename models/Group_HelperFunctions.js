
const Group = require('../models/Group');
const jwt = require('jsonwebtoken');
const JsonWebToken = require('../controllers/JWT/JsonWebToken');

//counts the number of groups a user organizes
async function getNumberOfGroups(req){

	const g = await Group.findAndCountAll({ 
			where: {
				organizer: JsonWebToken.getUsername(req.cookies.soccer_secret)
			},
			limit: 2
		}).then(result => {
			return result.count;
		})
}

//prints all groups
async function printGroups(req, res){

	//console.log("GROUP TITLE: " + group[0].title); //use array if using Group.findAll
	//console.log("GROUP TITLE: " + group.title); //use this if using Group.findOne
	try{
		var group = await Group.findAll({ where: { organizer: JsonWebToken.getUsername(req.cookies.soccer_secret)} });

		res.render('group', {username: JsonWebToken.getUsername(req.cookies.soccer_secret), myGroups: group[0].title, Error: ''});
	}catch(err){
		console.log(err);
	}
}

module.exports = {
	getNumberOfGroups: getNumberOfGroups,
	printGroups: printGroups
}