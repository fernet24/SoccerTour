
//const connection = require('database/databaseConfig');

class User{
	constructor(id, username, email, password){
		this.id = id;
		this.username = username;
		this.email = email;
		this.password = password;
	}

	//get methods
	getID(){
		return this.id;
	}

	getUsername(){
		return this.username;
	}

	getEmail(){
		return this.email;
	}

	getPassword(){
		return this.password;
	}

	//set methods
	setUsername(username){
		this.username = username;
	}

	setEmail(email){
		this.email = email;
	}

	setPassword(password){
		this.password = password;
	}

	//find user
	findID(id){
		//sql query

		//return username
	}
}














//************************************************************
//ORM-SEQUELIZE

/*
var User = connection.define('user', {
	username: {
		type: DataTypes.STRING,
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
		type: DataTypes.STRING,
		unique: true,
		allowNull: false,
		isEmail: true
	},
	password: {
		type: DataTypes.STRING,
		allowNull: false
	}
});

*/

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

connection.sync({

}).then(function(){
	return User.create({
		username: 'timmyy',
		email: 'cool@test.com',
		password: 'aaaa'
	})
}).catch(function (error){ //catch any then function errors
	console.log(error);

});

*/