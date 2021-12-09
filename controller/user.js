// Models
const User = require('../model/user');
const Book = require('../model/book');
const Issue = require('../model/issue');
// Helper
const {CalculateFine}= require('../helper/CalculateFine');

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const key = process.env.JWT_KEY;


// Issue Book
exports.postIssueBook = async (req, res) => {
    const token = req.headers.authorization.replace("Bearer ","");
    const decoded = jwt.verify(token, key);
    const userId = decoded.id;

    // Fetch the user
    const user = await User.findByPk(userId).catch(err => console.log(err));

    // Checking violation flag
    if (user.violationFlag){
        return res.status(400).send('Cannot issue, please pay the fine!');
    }
    // Fetch book
    const book = await Book.findOne({where:{ isbn: req.body.isbn }}).catch(err => console.log(err));
    if (!book) {
        return res.status(404).send('Book not found');
    }
    else {
        // Create new issue
        const newIssue = new Issue({
            user: userId,
            book: book.id
        }).save().catch(err => console.log(err));
        // Update issue in Book
        book.issued+=1;
        book.save();
        return res.status(200).send('Success, Book has been issued!');
    }
};

// Return Book
exports.postReturnBook = async (req,res) => {
    const token = req.headers.authorization.replace("Bearer ","");
    const decoded = jwt.verify(token, key);
    const userId = decoded.id;

    // Find book
    const book= await Book.findOne(
        {where:{ isbn: req.body.isbn }}
        ).catch(err => console.log(err));

    if (!book){
        return res.status(400).send('Book with this ISBN is not present!');
    }
    // Find issue
    const issue = await Issue.findOne({where:{
        user:userId,
        book:book.id,
        returned:false
        }
    }).catch(err => console.log(err));
    if(!issue){
        return res.status(200).send('User has not issued this book');
    }
    else{
        // Updating issue
        issue.returned=true;
        issue.save().catch(err => console.log(err));
        // Updating book
        book.issued-=1;
        book.save().catch(err => console.log(err));
        // Checking if user has delayed return
        if(issue.return_date<Date.now()){
            CalculateFine();
            const return_delay = Math.ceil((Date.now()-issue.return_date)/(24 * 60 * 60 * 1000));
            const fine = return_delay*10;
            const user = await User.findOne({where:{id:userId}}).catch(err => console.log(err));
            user.fine-=fine;
            if (user.fine === 0){
                user.violationFlag=false;
            }
            user.save().catch(err => console.log(err));
            return res.status(200).send(`Book has been returned, pay fine of ${fine}.`);
        }

        return res.status(200).send('Success, Book has been returned!');
    }

}

// User Info
exports.getUserInfo = async (req, res) => {
    const token = req.headers.authorization.replace("Bearer ","");
    const decoded = jwt.verify(token, key);
    const userId = decoded.id;
    // Fetch the user by id
    const user = await User.findOne({
        where:{
            id:userId
        },
        attributes:['name','email','violationFlag','fine']
    })
        .catch(err => console.log(err));
    return res.status(200).send(user);

};

// Fetch user history
exports.getUserHistory = async (req, res) => {
    const token = req.headers.authorization.replace("Bearer ","");
    const decoded = jwt.verify(token, key);
    const userId = decoded.id;
    // Fetch issues by user
    const issue = await Issue.findAll({where:{user:userId}}).catch(err => console.log(err));
    return res.status(200).json(issue);
};

// Update user profile
exports.putUpdateUser = async (req,res) =>{
    const email = req.body.email;
    const name = req.body.name;
    const password = req.body.password;
    const password2 = req.body.password2;

    const token = req.headers.authorization.replace("Bearer ","");
    const decoded = jwt.verify(token, key);
    const userId = decoded.id;
    const user = await User.findByPk(userId).catch(err => console.log(err));
    
    if (email){
        const user_with_provided_mail = await User.findOne({where:{ email: req.body.email }}).catch(err => console.log(err));
        if (user_with_provided_mail){
            return res.status(409).json({ email: "User with this email already exists!" });
        }
        else{
            user.email = email;
        }
    }
    if (name){
        user.name = name;
        }
    if (password){
        // Hashing the password
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(user.password, salt, (err, hash) => {
                if (err) throw err;
                user.password = hash;
            });
        });
      }
    user.save().catch(err => console.log(err));
    return res.status(200).send("User profile updated");
    };