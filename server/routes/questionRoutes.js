const express = require('express');
const router = express.Router();
const questionController = require('../controllers/questionController');
const isLoggedIn = require('../middlewares/UserMiddleware.js');

router.get('/', questionController.getAllQuestions);
router.get('/newest', questionController.sortQuestionsByNewest);
router.get('/activity', questionController.sortQuestionsByActivity);
router.get('/unanswered', questionController.getUnansweredQuestions);
router.get('/search/:query?', questionController.search);
router.get('/fetchUserQuestions', questionController.fetchUserQuestions);


router.get('/:id', questionController.getQuestionById);

router.put('/:id/update', questionController.updateQuestionById);
router.get('/:id/incrementViewCount', questionController.incrementViewCount);


router.post('/add', isLoggedIn, questionController.addNewQuestion);

router.delete('/:id', questionController.deleteQuestionById);

module.exports = router;
