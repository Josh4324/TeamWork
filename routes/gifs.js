const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');


const userController = require('../controllers/gifs')

router.get('/:gif_id', auth.authorization, userController.getOneGif);
router.post('/', auth.authorization, userController.createGif);
router.post('/:gif_id/comment', auth.authorization, userController.addComment);
router.delete('/:gif_id', auth.authorization, userController.deleteGif)

module.exports = router;