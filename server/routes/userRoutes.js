const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const isLoggedIn = require('../middlewares/UserMiddleware');

// router.get('/', userController.getAllUsers);
router.get('/getUserProfile', isLoggedIn, userController.getUserProfile);


module.exports = router;