const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const validation = require("../middleware/validation");



const userController = require('../controllers/employee')

router.post('/create-user', validation.signUpValidationRules(), validation.validation, userController.signup);
router.post('/login', validation.signInValidationRules(), validation.validation, userController.login);



module.exports = router;