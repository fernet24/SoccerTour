const { Router } = require('express');
const authController = require('../controllers/authController');

const router = Router();

router.get('', authController.index_get);
router.get('/login', authController.login_get);
router.get('/signup', authController.signup_get);
router.get('/homepage', authController.homepage_get);
router.get('/search', authController.search_get);
router.get('/profile', authController.profile_get);
router.post('/signup', authController.signup_post);

module.exports = router;

