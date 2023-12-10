const express = require('express');
const router = express.Router();
const tagController = require('../controllers/tagController');
const isLoggedIn = require('../middlewares/UserMiddleware.js');

router.get('/', tagController.getAllTags);
router.get('/questionCount', tagController.getTagsAndQuestionCount);
router.get('/name/:name', tagController.getTagByName);
router.get('/:id', tagController.getTagById);
router.get('/byUsername/:username', tagController.getTagsByUsername);

router.put('/:oldTagName/update',isLoggedIn, tagController.updateTagByName);

router.delete('/deleteByName/:name', isLoggedIn, tagController.deleteByName);


module.exports = router;
