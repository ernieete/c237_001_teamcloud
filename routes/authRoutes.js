const express = require('express');
const authController = require('../controllers/authController');
const { requireGuest } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/login', requireGuest, authController.showLogin);
router.post('/login', requireGuest, authController.login);
router.get('/register', requireGuest, authController.showRegister);
router.post('/register', requireGuest, authController.register);
router.get('/logout', authController.logout);

module.exports = router;
