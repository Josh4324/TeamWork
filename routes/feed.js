const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const userController = require('../controllers/feed');


router.get('/', auth.authorization, userController.getAllArticlesAndGifs);
router.get('/comment/article/:article_id', auth.authorization, userController.getArticleComments);
router.get('/comment/gif/:gif_id', auth.authorization, userController.getGifComments);


module.exports = router;