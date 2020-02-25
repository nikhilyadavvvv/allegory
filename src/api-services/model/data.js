var Sequelize = require('sequelize');
var sequelize = require('../common/mysql');

var Data = sequelize.define("data", {
    id: {
        type: Sequelize.BIGINT(11),
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    story_id: {
        type: Sequelize.BIGINT(11)
    },
    image: {
        type: Sequelize.STRING(50),
        allowNull: false,
    },
    heading: {
        type: Sequelize.STRING(50),
        allowNull: false,
    },
    center: {
        type: Sequelize.STRING(50),
        allowNull: false,
    },
    footer: {
        type: Sequelize.STRING(50),
        allowNull: false,
    },
    animation: {
        type: Sequelize.STRING(50),
        allowNull: false,
    },
    fontColor: {
        type: Sequelize.STRING(50),
        allowNull: false,
    },
}
)
module.exports = Data;