var Sequelize = require('sequelize');
var sequelize = require('../common/mysql');

var User = sequelize.define("user", {
    id: {
        type: Sequelize.BIGINT(11),
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    name: {
        type: Sequelize.STRING(50)
    },
    email: {
        type: Sequelize.STRING(50),
        allowNull: false,
    },
    password: {
        type: Sequelize.STRING(50),
        allowNull: false,
    }
}
)
module.exports = User;