const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// router.get('/', userController.getAllUsers);
router.get('/getUsername', userController.getUsername);


module.exports = router;