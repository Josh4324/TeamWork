const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');


const userController = require('../controllers/employee')

router.post('/create-user', auth.authorizationsignup, userController.signup);
router.post('/signin', userController.login);



module.exports = router;