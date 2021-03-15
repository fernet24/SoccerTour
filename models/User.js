
//ORM-SEQUELIZE

/*
var Sequelize = require('sequelize');

var connection = new Sequelize('soccertour', 'root', '');

var Client = connection.define('client', {
	username: Sequelize.STRING,
	email: Sequelize.STRING,
	password: Sequelize.STRING
});

connection.sync().then(function(){
	Client.create({
		email: 'hello@test.com',
		username: 'hello',
		password: 'hhh'
	});
})
*/