const express = require('express');
const router = express.Router();
const questionController = require('../controllers/questionController');
const isLoggedIn = require('../middlewares/UserMiddleware.js');

router.get('/', questionController.getAllQuestions);
router.get('/newest', questionController.sortQuestionsByNewest);
router.get('/activity', questionController.sortQuestionsByActivity);
router.get('/unanswered', questionController.getUnansweredQuestions);
router.get('/search/:query?', questionController.search);
router.get('/fetchUserQuestions', questionController.fetchUserQuestions); // Corrected route path
router.get('/:id/incrementViewCount', questionController.incrementViewCount);
router.get('/:id', questionController.getQuestionById);
router.post('/add', isLoggedIn, questionController.addNewQuestion);

module.exports = router;