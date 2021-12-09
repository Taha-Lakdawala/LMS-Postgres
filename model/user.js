const Sequelize = require("sequelize");
const db = require("../config/db");

const User = db.define("user",{
    id: {
        type: Sequelize.INTEGER,
        autoIncrement:true,
        allowNull: false,
        primaryKey: true,
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
    },
    violationFlag: { type: Sequelize.BOOLEAN, defaultValue: false },
    fine: { type: Sequelize.INTEGER, defaultValue: 0},
    isAdmin: { type: Sequelize.BOOLEAN, defaultValue: false }
},{
    timestamps:false
}
);
User.sync({alter:true});

module.exports = User;