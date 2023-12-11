const express = require('express');
const router = express.Router();
const voteController = require('../controllers/voteController');
const isLoggedIn = require('../middlewares/UserMiddleware');

router.post('/', isLoggedIn, voteController.vote);

module.exports = router;