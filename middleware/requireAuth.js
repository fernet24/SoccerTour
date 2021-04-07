
const jwt = require('jsonwebtoken');

const requireAuth = (req, res, next) => {

	const token = req.cookies.soccer_secret;

	//check existence of json web token 
	if(token){
		jwt.verify(token, 'soccer_secret' , (err, decodedToken) => {
			if(err){
				console.log(err.message);
				res.redirect('/login');
			}else{
				console.log(decodedToken);
				
				//print username
				const decoded = jwt.verify(token, 'soccer_secret');
				var userID = decoded.username;
				console.log('username: ' + userID);
				next();
			}
		});
	}else{
		res.redirect('/login');
	}
}

module.exports = requireAuth;