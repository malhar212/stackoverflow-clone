const express = require('express');
const router = express.Router();
const answerController = require('../controllers/answerController');
// const isLoggedIn = require("../middlewares/UserMiddleware.js");

router.get('/', answerController.getAllAnswers);
router.get('/filterByIds', answerController.filterAnswersBasedOnAnsIds);
router.get('/question/:id', answerController.filterAnswersBasedOnQuestionId);
// router.post('/add', isLoggedIn, answerController.addAnswer);
router.post('/add', answerController.addAnswer);

module.exports = router;