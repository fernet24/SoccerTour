
const Sequelize = require('sequelize');
const connection = require('../database/databaseConfig');

//Membership Model
var Membership = connection.define('membership', {
	username: {
		type: Sequelize.STRING,
		primaryKey: false, //was comment before
		foreignKey: true,
		unique: true,
		allowNull: false, //can user enter a null value (false)
		validate: {
			len: {
				args: [5, 20],
				msg: 'username not valid.'
			}
		}
	},
	groupTitle: {
		type: Sequelize.STRING,
		primaryKey: true,
		foreignKey: true,
		//unique: true,
		allowNull: false,
	}
})

module.exports = connection;
module.exports = Membership;
