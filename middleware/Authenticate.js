// Exporting models
const User = require('../model/user');

const jwt = require("jsonwebtoken");

// Check if user is logged in or not
exports.isLoggedIn = (req, res, next) => {
    try {
        const token = req.header('authorization').replace("Bearer ","");
        if (!token) return res.statusCode(401).send("You must be logged in first");

        const decoded = jwt.verify(token, process.env.JWT_KEY);
        req.user = decoded;

    } catch (error) {
        return res.status(400).send("Invalid token");
    }

    User.findByPk(req.user.id )
        .then(user=>{
            if (!user) {
                return res.status(404).send('User not found!');
            }
            next();
        })
        .catch(err => console.log(err));
}

// Check if user admin or not
exports.isAdmin = (req, res, next) => {

    User.findByPk(req.user.id).then(function (user) {
        if (user.isAdmin) {
            next();
        } else {
            return res.status(401).send('Sorry, this route is allowed for admin only!');
        }
    });
};