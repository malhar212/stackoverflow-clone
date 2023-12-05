// routes/authRoutes.js
const express = require('express');
const AuthController = require('../controllers/AuthController');
const router = express.Router();

// Specific routes should come before the generic one
router.post('/signup', AuthController.Signup);
router.post('/login', AuthController.Login);

module.exports = router;
