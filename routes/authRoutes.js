const { Router } = require('express');
const authController = require('../controllers/authController');
const requireAuth = require('../middleware/requireAuth');

const router = Router();

router.get('', authController.index_get);
router.get('/login', authController.login_get);
router.get('/signup', authController.signup_get);
router.get('/homepage', requireAuth, authController.homepage_get);
router.get('/search', requireAuth, authController.search_get);
router.get('/profile', requireAuth, authController.profile_get);
router.post('/signup', authController.signup_post);
router.post('/login', authController.login_post);

module.exports = router;

