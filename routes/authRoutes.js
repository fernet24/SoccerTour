const { Router } = require('express');
const authController = require('../controllers/authController');
const requireAuth = require('../middleware/requireAuth');

const router = Router();

//get
router.get('', authController.index_get);
router.get('/login', authController.login_get);
router.get('/signup', authController.signup_get);
router.get('/homepage', requireAuth, authController.homepage_get);
router.get('/notification', requireAuth, authController.notification_get);
router.get('/groupInfo', requireAuth, authController.groupInfo_get);
router.get('/group', requireAuth, authController.group_get);
router.get('/profile', requireAuth, authController.profile_get);
router.get('/logout', authController.logout_get);

//post
router.post('/signup', authController.signup_post);
router.post('/login', authController.login_post);
router.post('/group', authController.group_post);
router.post('/groupInfo', authController.groupInfo_post);

module.exports = router;

