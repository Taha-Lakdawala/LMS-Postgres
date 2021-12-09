const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const key = process.env.JWT_KEY;
// Models
const User = require('../model/user');


// Login
exports.postLogin = async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    // Find user by email
    User.findOne({where:{ email }}).then(user => {
        // Check if user exists
        if (!user) {
            return res.status(404).json({ emailnotfound: "Email not found" });
        }
        // Check password
        bcrypt.compare(password, user.password).then(isMatch => {
            if (isMatch) {
                // User matched
                // Create JWT Payload
                const payload = {
                    id: user.id,
                    name: user.name
                };
                // Sign token
                jwt.sign(
                    payload,
                    key,
                    {
                        expiresIn: 60 * 60 * 24 // 1 day in seconds
                    },
                    (err, token) => {
                        res.json({
                            success: true,
                            token: "Bearer " + token,
                        });
                    }
                );
            } else {
                return res.status(400).json({ error: "Password incorrect" });
            }
        });
    });
};

// User Signup
exports.postUserRegister = async (req, res, next) => {

    const user = await User.findOne({where: {email: req.body.email }});
    // Check if user exists
    if (user) {
        return res.status(409).json({ email: "Email already exists" });
    }
    // Creating new user
    else {
        const newUser = new User({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
        });
        // Hash password before saving in database
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
                if (err) throw err;
                newUser.password = hash;
                newUser.save().catch(err => console.log(err));
            });
        });
        return res.status(201).send('Success');
    }

};


// Admin Signup
exports.postAdminRegister = async (req, res) => {
    
    // Check if user exists
    const user = await User.findOne({where:{ email: req.body.email }}).catch(err => console.log(err));
    if (user) {
        return res.status(409).json({ email: "Email already exists" });
    }
    // Creating new user
    else {
        const newUser = new User({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            isAdmin: true
        });
        // Hash password before saving in database
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
                if (err) throw err;
                newUser.password = hash;
                newUser.save().catch(err => console.log(err));
            });
        });
        return res.status(201).send('Success');
    }
};
