const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');


const userController = require('../controllers/gifs')


router.post('/', auth.authorization, userController.createGif);

module.exports = router;