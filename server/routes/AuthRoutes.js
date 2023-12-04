const express = require('express');
const AuthController = require('../controllers/AuthController');
// const { userVerification } = require("../middlewares/AuthMiddleware")
const router = express.Router()

router.post('/signup', AuthController.Signup);
router.post('/login', AuthController.Login);
// router.post('/', userVerification)

module.exports = router;
