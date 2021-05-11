
const Group = require('./Group');
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
async function printGroups(req, res){

	var request = req.cookies.soccer_secret;

	//find all groups of a user
	var group = await Group.findAll({ 
			where: { 
				organizer: JsonWebToken.getUsername(request)
			}
		}).then(answer =>{

			//return number of groups
			var result = getNumberOfGroups(request).then(function(value){ 
				
				if(value == 0)
					res.render('group', {username: JsonWebToken.getUsername(request), firstGroup: '[empty]', secondGroup: '[empty]', Error: ''});
				else if(value == 1)
					res.render('group', {username: JsonWebToken.getUsername(request), firstGroup: answer[0].title, secondGroup: '[empty]', Error: ''});
				else if(value == 2)
					res.render('group', {username: JsonWebToken.getUsername(request), firstGroup: answer[0].title, secondGroup: answer[1].title, Error: ''});
				else if(value == 9)
					res.render('group', {username: JsonWebToken.getUsername(request), firstGroup: answer[0].title, secondGroup: answer[1].title, Error: 'Unable to create new groups. Reached group limit.'});
			})

		}).catch(err =>{
			console.log('PRINTGROUPS FUNCTION ERROR---> ' + err);
			res.render('group', {username: JsonWebToken.getUsername(request), firstGroup: '[ERROR]', secondGroup: '', Error: ''});
		})
}

module.exports = {
	getNumberOfGroups: getNumberOfGroups,
	printGroups: printGroups
}