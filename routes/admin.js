const express = require("express");
const router = express.Router();
// Middleware
const auth = require('../middleware/Authenticate');
const Validator = require('../middleware/Validator');
// Controller
const adminController = require('../controller/admin');


// Add Book
router.post('/admin/addBook', Validator('addBook'), auth.isLoggedIn ,auth.isAdmin , adminController.postAddNewBook);
// Remove Book
router.patch('/admin/removeBook', Validator('removeBook'), auth.isLoggedIn ,auth.isAdmin , adminController.patchRemoveBook);
// Remove Book
router.delete('/admin/removeUser', auth.isLoggedIn ,auth.isAdmin , adminController.deleteRemoveUser);
// Update Book
router.put('/admin/UpdateBook', Validator('updateBook'), auth.isLoggedIn ,auth.isAdmin , adminController.putUpdateBook);

module.exports = router;