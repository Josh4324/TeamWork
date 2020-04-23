const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');


const userController = require('../controllers/articles');

router.post('/', auth.authorization, userController.createArticle);
router.post('/:article_id/comment', auth.authorization, userController.addComment);
router.patch('/:article_id', auth.authorization, userController.editArticle);
router.delete('/:article_id', auth.authorization, userController.deleteArticle);




module.exports = router;