const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');

router.post('/:id/add', commentController.addComment);
router.get('/object/:id', commentController.getCommentsByAssociatedId);


module.exports = router;