
const connection = require('database/databaseConfig');

var Group = connection.define('group',{
	title: {
		type: Sequelize.STRING,
		primaryKey: true,
		unique: true,
		allowNull: false
	},
	date: {
		type: Sequelize.STRING
	},
	time: {
		type: Sequelize.STRING
	},
});

module.exports = connection;

/*

connection.sync({

}).then(function(){
	return Group.create({
		title: 'awesome',
		date: 'M/W',
		time: '3pm-5pm'
	})
}).catch(function (error){ //catch any then function errors
	console.log(error);

});
*/






























//******************************CLASS GROUP
/*
class Group{

	constructor(title, date, time, organizer, members = []){
		this.title = title;
		this.date = date;
		this.time = time;
		this.organizer = organizer;

		//SEARCH FOLLOWING SYNTAX
		this.members = members;

		//get methods


		//set methods

		//find group

	}
}
*/