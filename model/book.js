const Sequelize = require("sequelize");
const db = require("../config/db");

const Book = db.define("book",{
    id: {
        type: Sequelize.INTEGER,
        autoIncrement:true,
        allowNull: false,
        primaryKey: true,
    },
    bname: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    isbn: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        validate: {
            len: [10,13]
        }        
    },
    author: { 
        type: Sequelize.STRING,
        allowNull: false,
    },
    quantity :{
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    issued :{
        type: Sequelize.INTEGER,
        defaultValue: 0
    }
},{
    timestamps:false
}
);
Book.sync({alter:true});

module.exports = Book;