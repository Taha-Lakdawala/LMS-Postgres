const express = require("express");
const router = express.Router();
// Controller
const authController = require('../controller/auth');
// Middleware
Validator = require('../middleware/Validator');


// User login
router.post("/Login", Validator('login'), authController.postLogin);
// User signup
router.post("/Signup", Validator('register'), authController.postUserRegister);
// Admin signup
router.post("/admin/Signup", Validator('register'), authController.postAdminRegister);

module.exports = router