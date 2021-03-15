
const mysql = require('mysql');

const connection = mysql.createConnection({
	connectionLimit : 10,
	host: 'localhost',
	user: 'root',
	password: '',
	database: 'soccertour',
	insecureAuth : true
});

connection.connect(function(err){
	if(err) throw err;

	console.log('Connected...');
});

module.exports = connection;