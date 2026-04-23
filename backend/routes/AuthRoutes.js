const express = require('express');
const router = express.Router();

 const authController = require('../controllers/AuthController');
 const validationMiddleware = require('../middleware/ValidationMiddleware');

 router.post('/register', validationMiddleware.validateRegister, authController.register);
 router.post('/login', validationMiddleware.validateLogin, authController.login);

 module.exports = router;