const Sequelize = require("sequelize");
const db = require("../config/db");
const Book = require("./book");
const User = require("./user");

const Issue = db.define("issue",{
    id: {
        type: Sequelize.INTEGER,
        autoIncrement:true,
        allowNull: false,
        primaryKey: true,
    },
    user: {
        type: Sequelize.INTEGER,
        allowNull: false,
        refrences:{
            model: User,
            key: 'id'
        }
    },
    book: {
        type: Sequelize.INTEGER,
        allowNull: false,
        refrences:{
            model: Book,
            key: 'id'
        }
    },
    return_date: {
        type: Sequelize.DATE,
        defaultValue: () => new Date(Date.now() + 8*24*60*60*1000).setHours(0, 0, 0, 0)
    },
    returned: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
    }
});
Issue.sync({alter:true});

module.exports = Issue;