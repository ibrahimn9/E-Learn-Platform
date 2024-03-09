const db = require("../config/database");
class Admin {
	// constructor
	constructor(fullName, email, password, color, isVerified) {
		this.fullName = fullName;
		this.email = email;
		this.password = password;
		this.color = color;
		this.isVerified = isVerified;
	}
	save() {
		return db.execute(
			`INSERT INTO admins (fullName , email , password ,color , isVerified) VALUES (?,?,?,?,?) `,
			[this.fullName, this.email, this.password, this.color, this.isVerified]
		);
	}
	static fetchAll() {
		return db.execute("SELECT * FROM admins");
	}

	static findByEmailAndPassword(email, password) {
		return db.execute(
			"SELECT * FROM `admins` WHERE `email` = ? AND `password` = ?",
			[email, password]
		);
	}
	static findByEmail(email) {
		return db.execute(
			"SELECT * FROM `admins` WHERE `email` = ? ",
			[email]
		);
	}
	static findById(id) {
		return db.execute("SELECT * FROM admins WHERE `id` = ?  ", [id]);
	}
	static updateUserVerified(isVerified, id) {
		return db.execute(
			`UPDATE admins 
              SET isVerified = ?
              WHERE id = ?`,
			[isVerified, id]
		);
	}
    static updatePassword(password, id) {
		return db.execute(
			`UPDATE admins 
              SET password = ?
              WHERE id = ?`,
			[password, id]
		);
	}
}


module.exports = Admin;