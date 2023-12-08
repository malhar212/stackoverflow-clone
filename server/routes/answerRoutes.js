const express = require('express');
const router = express.Router();
const answerController = require('../controllers/answerController');

router.get('/', answerController.getAllAnswers);
router.get('/filterByIds', answerController.filterAnswersBasedOnAnsIds);
router.get('/question/:id', answerController.filterAnswersBasedOnQuestionId);
router.post('/add', answerController.addAnswer);

module.exports = router;