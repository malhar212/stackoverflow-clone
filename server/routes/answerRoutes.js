const express = require('express');
const router = express.Router();
const answerController = require('../controllers/answerController');
const isLoggedIn = require("../middlewares/UserMiddleware.js");

router.get('/', answerController.getAllAnswers);
router.get('/filterByIds', answerController.filterAnswersBasedOnAnsIds);
router.get('/question/:id', answerController.filterAnswersBasedOnQuestionId);
router.post('/add', isLoggedIn, answerController.addAnswer);
router.get('/fetchUserAnswers', answerController.fetchUserAnswers);
// <<<<<<< sam
// router.put('/:ansId', isLoggedIn, answerController.updateAnswerById);
// router.delete('/:ansId', isLoggedIn, answerController.deleteAnswerById);
// =======
router.put('/:ansId', answerController.updateAnswerById);
router.delete('/:ansId', answerController.deleteAnswerById);
router.put('/accept/:ansId', isLoggedIn, answerController.acceptAnswer);


module.exports = router;