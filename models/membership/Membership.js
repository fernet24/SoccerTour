
const Sequelize = require('sequelize');
const connection = require('../database/databaseConfig');

//Membership Model

var Membership = connection.define('membership', {
	username: {
		type: Sequelize.STRING,
		primaryKey: true,
		unique: true,
		allowNull: false, //can user enter a null value (false)
		validate: {
			len: {
				args: [5, 20],
				msg: 'username not valid.'
			}
		}
		references: {
			model: 'user',
			key: 'username'
		}
	},
	groupTitle: {
		type: Sequelize.STRING,
		primaryKey: true,
		unique: true,
		allowNull: false,
		references: {
			model: 'group',
			key: 'title'
		}
	}
})

module.exports = connection;
module.exports = Membership;
