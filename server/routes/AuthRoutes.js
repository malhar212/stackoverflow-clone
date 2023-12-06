// routes/authRoutes.js
const express = require('express');
const AuthController = require('../controllers/AuthController');
const router = express.Router();

// Specific routes should come before the generic one
router.post('/signup', AuthController.signup);
router.post('/login', AuthController.login);
router.post('/logout', AuthController.logout);
router.post('/checkLoginGetUsername', AuthController.checkLoginGetUsername);
// router.get('/csrf-token', AuthController.CsrfToken)

module.exports = router;
