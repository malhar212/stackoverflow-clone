const express = require('express');
const router = express.Router();
const answerController = require('../controllers/answerController');
const isLoggedIn = require("../middlewares/UserMiddleware.js");

router.get('/', answerController.getAllAnswers);
router.get('/filterByIds', answerController.filterAnswersBasedOnAnsIds);
router.get('/question/:id', answerController.filterAnswersBasedOnQuestionId);
router.post('/add', isLoggedIn, answerController.addAnswer);
router.get('/fetchUserAnswers', answerController.fetchUserAnswers);
router.put('/:ansId', answerController.updateAnswerById);
router.delete('/:ansId', answerController.deleteAnswerById);


module.exports = router;