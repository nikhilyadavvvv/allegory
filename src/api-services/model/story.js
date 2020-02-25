var Sequelize = require('sequelize');
var sequelize = require('../common/mysql');

var Story = sequelize.define("story", {
    id: {
        type: Sequelize.BIGINT(11),
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    name: {
        type: Sequelize.STRING(50)
    },
    user_id: {
        type: Sequelize.BIGINT(11),
        allowNull: false,
    },
    background: {
        type: Sequelize.STRING(50),
        allowNull: false,
    }
}
)
module.exports = Story;