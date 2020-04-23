const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');


const userController = require('../controllers/feed');


router.get('/', auth.authorization, userController.getAllArticlesAndGifs);


module.exports = router;