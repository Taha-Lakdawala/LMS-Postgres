// Models
const Book = require('../model/book');
const Issue = require('../model/issue');


// Fetch Book details
exports.getBookDetails = async (req, res) => {
    // Finding book
    const book= await Book.findOne({where:{isbn:req.params.isbn}}).catch(err => console.log(err));
    if (!book) {
        return res.status(200).send('Book not found');
    }
    res.status(200).send(book);
};

// Fetch Book History
exports.getBookHistory = async (req, res) => {
    // Finding book
    const book = await Book.findOne({where:{isbn:req.params.isbn}}).catch(err => console.log(err));
    if (!book) {
        return res.status(200).send('Book not found');
    }
    // Find all issues of a book by passing bookId
    const issue = await Issue.findAll({where:{id:book.id}}).catch(err => console.log(err));

    return res.status(200).json(issue);
};

// Fetch all the books
exports.getBooks = async (req, res) => {
    const books = await Book.findAll({attributes: ['bname', 'author','isbn']}).catch(err => console.log(err));

    return res.status(200).json(books)

};