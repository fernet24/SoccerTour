
//ORM-SEQUELIZE

/*

var Sequelize = require('sequelize');

const connection = new Sequelize(
    'sequelize_testing',
    'root',
    '',
    {
        host: 'localhost',
        dialect: 'mysql',
        pool: {
            max: 5,
            min: 0,
            require: 30000,
            idle: 10000
        },
        //logging: false
    }
);

var Client = connection.define('client', {
	username: Sequelize.STRING,
	email: Sequelize.STRING,
	password: Sequelize.STRING
});

connection.sync().then(function(){
	Client.create({
		email: 'hello@test.com',
		username: 'hello',
		password: 'hhh',
	});
})

*/