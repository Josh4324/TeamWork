const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const validation = require("../middleware/validation");


const userController = require('../controllers/gifs')

router.get('/:gif_id', auth.authorization, userController.getOneGif);
router.post('/', auth.authorization, validation.postGifsRules(), validation.validation, userController.createGif);
router.post('/:gif_id/comment', auth.authorization, validation.postCommentRules(), validation.validation, userController.addComment);
router.patch('/:comment_id/flag', auth.authorization, userController.flagComment);
router.patch('/:gif_id/flag', auth.authorization, userController.flagGif);
router.patch('/:gif_id/', auth.authorization, userController.flagComment);
router.delete('/:gif_id', auth.authorization, userController.deleteGif)
router.delete('/flag', auth.authorizationsignup, userController.deleteFlagGif);
router.delete('/comment/flag', auth.authorizationsignup, userController.deleteFlagComment);


module.exports = router;