const express = require("express");
const router = express.Router();
// middleware
const auth = require("../middleware/Authenticate");
const Validate = require("../middleware/Validator");
// Controller
const userController = require('../controller/user');


// Fetch user info
router.get("/UserInfo", auth.isLoggedIn, userController.getUserInfo);
// Fetch user history
router.get("/UserHistory", auth.isLoggedIn, userController.getUserHistory);
// Update user profile
router.put("/UpdateProfile", Validate('updateUser'), auth.isLoggedIn, userController.putUpdateUser);
// Issue Book
router.post("/IssueBook", Validate('findBook'), auth.isLoggedIn, userController.postIssueBook);
// Return Book
router.post("/ReturnBook", Validate('findBook'), auth.isLoggedIn, userController.postReturnBook);

module.exports = router;