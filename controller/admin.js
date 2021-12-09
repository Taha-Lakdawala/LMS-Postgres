// Models
const Book = require('../model/book');
const User = require('../model/user');
const Issue = require('../model/issue');


// Add Book
exports.postAddNewBook = async (req, res, next) => {

    const book = await Book.findOne({where:{ isbn: req.body.isbn }}).catch(err => console.log(err));
    const quantity = req.body.quantity;

    if (book) {
        book.quantity+=quantity;
        book.save().catch(err => console.log(err));
    }
    else {
        const newBook = new Book({
            bname: req.body.bname,
            isbn: req.body.isbn,
            author: req.body.author,
            quantity: req.body.quantity
        });
        newBook.save().catch(err => console.log(err));
    }

    return res.status(200).send('Success');
};

// Remove Book
exports.patchRemoveBook = async (req, res) => {

    let quantity = req.body.quantity;
    if (!quantity){
        quantity=1
    }
    const book = await Book.findOne({where:{ isbn: req.body.isbn }}).catch(err => console.log(err));

    if (!book) {
        return res.status(404).send('Book not found');
    }
    if (book.quantity-book.issued<quantity){
        return res.status(400).send('Please enter proper quantity');
    }
    else if (book.issued === 0 && book.quantity === quantity){
        book.destroy().catch(err => console.log(err));
    }
    else{
        book.quantity-=quantity;
        book.save().catch(err => console.log(err));
    }
    return res.status(200).send('Success');
};

exports.deleteRemoveUser = async (req,res) => {

    const email = req.body.email;
    const user  = await User.findOne({where:{email}}).catch(err => console.log(err));
    if (!user){
        return res.status(404).send('No such user exists');
    }
    const issues = await Issue.findAll({where:{user:user.id}}).catch(err => console.log(err));

    for (let issue of issues){
        let book= await Book.findByPk(issue.book).catch(err => console.log(err));
        book.issued-=1;
        if  (!issue.returned){
            book.quantity-=1;
        }
        book.save().catch(err => console.log(err));
        Issue.destroy({where:{id:issue.id}}).catch(err => console.log(err));
    }
    user.destroy().catch(err => console.log(err));
    return res.status(200).send('User deleted');
};

exports.putUpdateBook = async (req,res) => {

    const isbn = req.body.isbn;
    const bname = req.body.bname;
    const author = req.body.author;
    const book = await Book.findOne({where:{isbn}}).catch(err => console.log(err));
    if (bname){
        book.bname=bname;
    }
    if(author){
        book.author = author
    }
    book.save().catch(err => console.log(err));
    return res.status(200).send('Book Updated');
};