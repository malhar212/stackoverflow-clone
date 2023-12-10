const express = require('express');
const router = express.Router();
const tagController = require('../controllers/tagController');

router.get('/', tagController.getAllTags);
router.get('/questionCount', tagController.getTagsAndQuestionCount);
router.get('/name/:name', tagController.getTagByName);
router.get('/:id', tagController.getTagById);
router.get('/byUsername/:username', tagController.getTagsByUsername);

router.delete('/deleteByName/:name', tagController.deleteByName);


module.exports = router;
