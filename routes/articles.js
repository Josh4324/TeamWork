const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const validation = require("../middleware/validation");

const userController = require('../controllers/articles');

router.get('/:article_id', auth.authorization, userController.getOneArticle);
router.post('/', auth.authorization, validation.postArticlesRules(), validation.validation, userController.createArticle);
router.post('/:article_id/comment', auth.authorization, validation.postCommentRules(), validation.validation, userController.addComment);
router.patch('/:comment_id/flag', auth.authorization, userController.flagComment);
router.patch('/:article_id/flag', auth.authorization, userController.flagArticle);
router.patch('/:article_id', auth.authorization,validation.updateArticleRules(), validation.validation, userController.editArticle);
router.delete('/:article_id', auth.authorization, userController.deleteArticle);
router.delete('/flag', auth.authorizationsignup, userController.deleteFlagArticle);
router.delete('/comment/flag', auth.authorizationsignup, userController.deleteFlagComment);


module.exports = router;