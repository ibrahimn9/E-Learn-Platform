const mysql = require("mysql2")

const pool = mysql
	.createPool({
		host: process.env.DB_HOST,
		user: process.env.DB_USER,
		password: process.env.DB_PASSWORD,
		database: process.env.DB_NAME,
	})
	.promise();

module.exports = pool;
// for using the the power of promise with async/await or chaining the promise with .then().catch()
