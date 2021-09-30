
const Group = require('./Group');
const Membership = require('../membership/Membership');
const jwt = require('jsonwebtoken');
const JsonWebToken = require('../../controllers/JWT/JsonWebToken');

//counts the number of groups a user organizes
async function getNumberOfGroups(request){

	var g = await Group.findAndCountAll({ 
			where: {
				organizer: JsonWebToken.getUsername(request)
			},
			limit: 2
		}).then(result => {
			
			if(result.count == 0)
				return 0;
			else if(result.count == 1)
				return 1;
			else if(result.count == 2)
				return 2;
			else
				return 9;
			
		}).catch(err =>{
			console.log('GETNUMBEROFGROUPS ERROR--> ' + err);
		});

		var total = `${g}`;
		console.log(`User has ${g} group(s)`);

		return total;
}

//prints all groups
async function printGroups(req, res, Membership, memberOf){

	var request = req.cookies.soccer_secret;

	//find groups which user is a member of
	var members = await Membership.findAll({
		where: {
			username: JsonWebToken.getUsername(request)
		}
	}).then(answer =>{

		if(answer.length != 0){
			for(i = 0; i < answer.length; i++)
				memberOf[i] = answer[i].groupTitle;
		}
		else
			memberOf = [answer[0].groupTitle];

		console.log('MEMBER OF: ' + memberOf);

	}).catch(err =>{
		console.log('ERROR IN CALLING Membership TABLE: ' + err);
	})

	//find all groups of a user
	var group = await Group.findAll({ 
			where: { 
				organizer: JsonWebToken.getUsername(request)
			}
		}).then(answer =>{

			//return number of groups
			var result = getNumberOfGroups(request).then(function(value){ 
				
				if(value == 0)
					res.render('group', {username: JsonWebToken.getUsername(request), firstGroup: '[empty]', secondGroup: '[empty]', myGroups: memberOf , Error: ''});
				else if(value == 1)
					res.render('group', {username: JsonWebToken.getUsername(request), firstGroup: answer[0].title, secondGroup: '[empty]', myGroups: memberOf , Error: ''});
				else if(value == 2)
					res.render('group', {username: JsonWebToken.getUsername(request), firstGroup: answer[0].title, secondGroup: answer[1].title, myGroups: memberOf , Error: ''});
				else if(value == 9)
					res.render('group', {username: JsonWebToken.getUsername(request), firstGroup: answer[0].title, secondGroup: answer[1].title, myGroups: memberOf , Error: 'Unable to create new groups. Reached group limit.'});
			})

		}).catch(err =>{
			console.log('PRINTGROUPS FUNCTION ERROR---> ' + err);
			res.render('group', {username: JsonWebToken.getUsername(request), firstGroup: '[ERROR]', secondGroup: '', myGroups: memberOf , Error: ''});
		})
}

module.exports = {
	getNumberOfGroups: getNumberOfGroups,
	printGroups: printGroups
}