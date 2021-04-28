
const Group = require('./Group');
const jwt = require('jsonwebtoken');
const JsonWebToken = require('../../controllers/JWT/JsonWebToken');

//counts the number of groups a user organizes
async function getNumberOfGroups(request){

	try{
		const g = await Group.findAndCountAll({ 
			where: {
				organizer: JsonWebToken.getUsername(request)
			},
			limit: 2
		}).then(result => {
			console.log('Total-----> ' + result.count);
			return result.count;
		})

	}catch(err){
		console.log('GETNUMBEROFGROUPS ERROR--> ' + err);
	}

}

//prints all groups
async function printGroups(req, res){

	var request = req.cookies.soccer_secret;

	try{
		var group = await Group.findAll({ 
			where: { 
				organizer: JsonWebToken.getUsername(request)
			} 
		});

		if(getNumberOfGroups(req.cookies.soccer_secret) == null)
			res.render('group', {username: JsonWebToken.getUsername(request), myGroups: '', Error: ''});
		else if(getNumberOfGroups(req.cookies.soccer_secret) == 1)
			res.render('group', {username: JsonWebToken.getUsername(request), myGroups: group[0].title, Error: ''});
		else
			res.render('group', {username: JsonWebToken.getUsername(request), myGroups: 'ALL', Error: ''});
	}catch(err){
		console.log('PRINTGROUPS FUNCTION ERROR---> ' + err);
		res.render('group', {username: JsonWebToken.getUsername(request), myGroups: '', Error: ''});
	}
}

module.exports = {
	getNumberOfGroups: getNumberOfGroups,
	printGroups: printGroups
}