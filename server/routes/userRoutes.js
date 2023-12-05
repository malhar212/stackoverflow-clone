const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// router.get('/', userController.getAllUsers);
router.get('/getUsernameByUid', userController.getUsernameByUid);
// router.post('/newUser', userController.newUser);


module.exports = router;