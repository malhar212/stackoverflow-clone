const express = require('express');
const router = express.Router();
const questionController = require('../controllers/questionController');
const isLoggedIn = require('../middlewares/UserMiddleware.js');


router.get('/', questionController.getAllQuestions);
router.get('/newest', questionController.sortQuestionsByNewest);
router.get('/activity', questionController.sortQuestionsByActivity);
router.get('/unanswered', questionController.getUnansweredQuestions);
router.get('/search/:query?', questionController.search);
router.get('/:id', questionController.getQuestionById);

// Authenticated routes
router.post('/add', isLoggedIn, questionController.addNewQuestion);
router.delete('/:id', isLoggedIn, questionController.deleteQuestionById);
router.put('/:id/update', isLoggedIn, questionController.updateQuestionById);
router.get('/:id/incrementViewCount', questionController.incrementViewCount);

// User-specific routes
router.get('/user/:username/questions', questionController.fetchUserQuestions);

module.exports = router;
