// Calculate Fine
const Issue = require("../model/issue");
const User = require("../model/user");
const Sequelize = require("sequelize");
const { Op } = require('sequelize')

exports.CalculateFine = async () => {
    // Finding User's issues which had passed the returned date
    const issues = await Issue.findAll({
        // include: [{dates: Issue.return_date}],
            where: {
                returned: false,
                return_date: {
                    [Op.lt]: new Date(Date.now())
                },
            },
            attributes: ['user',[Sequelize.fn('array_agg', Sequelize.col('return_date')), 'dates']],
            group: ['user'],
            raw: true
        })

    for (let issue of issues) {
        let fine = 0;
        // Calculate Fine
        for (let date of issue.dates) {
            let return_delay = Math.ceil((Date.now() - date) / (24 * 60 * 60 * 1000));
            fine += return_delay * 10;
        }
        // Updating fine in user
        const user = await User.findByPk(issue.user).catch(err => console.log(err));
        if (!user) {
            continue;
        }
        user.violationFlag = true;
        user.fine = fine;
        await user.save().catch(err => console.log(err));
    }
};
