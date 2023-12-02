const express = require('express');
const router = express.Router();
const questionController = require('../controllers/questionController');

router.get('/', questionController.getAllQuestions);
router.get('/newest', questionController.sortQuestionsByNewest);
router.get('/recentlyAnswered', questionController.sortQuestionsByRecentAnswers);
router.get('/unanswered', questionController.getUnansweredQuestions);
router.get('/search/:query?', questionController.search);
router.get('/:id/incrementViewCount', questionController.incrementViewCount);
router.get('/:id', questionController.getQuestionById);
router.post('/add', questionController.addNewQuestion);

module.exports = router;