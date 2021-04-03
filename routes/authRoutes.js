const { Router } = require('express');
const authController = require('../controllers/authController');

const router = Router();

const jwt = require('jsonwebtoken');

const requireAuth = (req, res, next) => {

	const token = req.cookies.jwt;

	//check json web token exists is verified
	if(token){
		jwt.verify(token, 'jwt', (err, decodedToken) => {
			if(err){
				console.log(err.message);
				res.redirect('/login');
			}else{
				console.log(decodedToken);
				next();
			}
		});
	}else{
		res.redirect('/login');
	}
}

router.get('', authController.index_get);
router.get('/login', authController.login_get);
router.get('/signup', authController.signup_get);
router.get('/homepage', authController.homepage_get);
router.get('/search', authController.search_get);
router.get('/profile', requireAuth, authController.profile_get);
router.post('/signup', authController.signup_post);
router.post('/login', authController.login_post);

module.exports = router;

