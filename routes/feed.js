const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const userController = require('../controllers/feed');


router.get('/', auth.authorization, userController.getAllArticlesAndGifs);
router.get('/:article_id/comment', auth.authorization, userController.getArticleComments);
router.get('/:gif_id/comment', auth.authorization, userController.getGifComments);


module.exports = router;