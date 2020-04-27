const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const validation = require("../middleware/validation");



const userController = require('../controllers/employee')

router.post('/create-user', auth.authorizationsignup, validation.signUpValidationRules(), validation.userValidation, userController.signup);
router.post('/signin', userController.login);



module.exports = router;