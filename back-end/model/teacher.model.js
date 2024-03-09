const db = require("../config/database")

class Teacher {
	// constructor
	constructor(fullName, email, password, color, isVerified, adminCreator) {
		this.fullName = fullName;
		this.email = email;
		this.password = password;
		this.color = color;
		this.isVerified = isVerified;
		this.adminCreator = adminCreator;
	}
	save() {
		return db.execute(
			`INSERT INTO teachers (fullName , email , password ,color,isVerified , adminCreator) VALUES (?,?,?,?,?,?) `,
			[
				this.fullName,
				this.email,
				this.password,
				this.color,
				this.isVerified,
				this.adminCreator,
			]
		);
	}
	static fetchAll() {
		return db.execute("SELECT * FROM teachers");
	}

	static findByEmailAndPassword(email, password) {
		return db.execute(
			"SELECT * FROM `teachers` WHERE `email` = ? AND `password` = ?",
			[email, password]
		);
	}
	static findByEmail(email) {
		return db.execute(
			"SELECT * FROM `teachers` WHERE `email` = ? AND `password` = ?",
			[email]
		);
	}
	static findById(id) {
		return db.execute("SELECT * FROM teachers WHERE `id` = ?  ", [id]);
	}
	static updateUserVerified(isVerified, id) {
		return db.execute(
			`UPDATE teachers 
              SET isVerified = ?
              WHERE id = ?`,
			[isVerified, id]
		);
	}
	static updatePassword(password, id) {
		return db.execute(
			`UPDATE teachers 
              SET password = ?
              WHERE id = ?`,
			[password, id]
		);
	}
}

module.exports = Teacher;