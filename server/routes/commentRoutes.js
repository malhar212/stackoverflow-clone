const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const isLoggedIn = require('../middlewares/UserMiddleware');

router.post('/add', isLoggedIn, commentController.addComment);
router.get('/object/:id', commentController.getCommentsByAssociatedId);


module.exports = router;