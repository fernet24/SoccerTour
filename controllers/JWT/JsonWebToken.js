
const jwt = require('jsonwebtoken');

//jwt secret [sensitive information]
const getSecretName = 'soccer_secret';

//maxAge determines the life span of a json web token in seconds. The following is 1 day in seconds.
const maxAge = 1 * 24 * 60 * 60; 

//createToken function creates & signs a json web token to later authenticate a user into their account
function createToken (username) {
	return jwt.sign( { username }, getSecretName, {
		expiresIn: maxAge
	});
}

//decodes json web token and returns username
function getUsername(req) {
	const decoded = jwt.verify(req, getSecretName);
	return decoded.username;
}

function getCookieSecret(req){
	return req.cookie.soccer_secret;
}

module.exports = {
	getUsername: getUsername,
	maxAge: maxAge,
	createToken: createToken,
	getSecretName: getSecretName,
	getCookieSecret: getCookieSecret
}
