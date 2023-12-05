// routes/authRoutes.js
const express = require('express');
const AuthController = require('../controllers/AuthController');
const router = express.Router();

// Specific routes should come before the generic one
router.post('/signup', AuthController.Signup);
router.post('/login', AuthController.Login);
router.post('/checkLoginGetUsername', AuthController.checkLoginGetUsername);
// router.get('/csrf-token', AuthController.CsrfToken)

module.exports = router;
