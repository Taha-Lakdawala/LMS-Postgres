const express = require("express");
const router = express.Router();
// middleware
const auth = require("../middleware/Authenticate");
// Controller
const bookController = require('../controller/book');

// Fetch all the books
router.get("/books", bookController.getBooks);
// Fetch individual book details
router.get("/book/details/:isbn", bookController.getBookDetails);
// Fetch individual book history
router.get("/book/history/:isbn",auth.isLoggedIn, auth.isAdmin, bookController.getBookHistory);

module.exports = router;