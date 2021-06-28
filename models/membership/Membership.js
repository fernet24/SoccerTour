
const Sequelize = require('sequelize');
const connection = require('../database/databaseConfig');

//Membership Model
/*
var Membership = connection.define('membership', {
	username: {

	}
	groupTitle: {

	}
})

var User = connection.define('user', {
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
	},
	email: {
		type: Sequelize.STRING,
		unique: true,
		allowNull: false,
		isEmail: true
	},
	password: {
		type: Sequelize.STRING,
		allowNull: false
	}
});
*/