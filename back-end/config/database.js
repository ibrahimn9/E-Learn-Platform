const mysql = require("mysql2");

const pool = mysql
	.createPool({
		host: process.env.MYSQL_ADDON_HOST,
		user: process.env.MYSQL_ADDON_USER,
		password: process.env.MYSQL_ADDON_PASSWORD,
		database: process.env.MYSQL_ADDON_DB,
	})
	.promise();
	
	module.exports = pool;
	// for using the the power of promise with async/await or chaining the promise with .then().catch()
	
	// For Production
	// host: process.env.MYSQL_ADDON_HOST,
	// database: process.env.MYSQL_ADDON_DB,
	// user: process.env.MYSQL_ADDON_USER,
	// password: process.env.MYSQL_ADDON_PASSWORD,
	