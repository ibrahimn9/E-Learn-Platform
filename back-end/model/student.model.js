const db = require("../config/database");

class Student {
	// constructor
	constructor(
		fullName,
		email,
		password,
		color,
		isVerified,
		adminCreator,
		idGroupe
	) {
		this.fullName = fullName;
		this.email = email;
		this.password = password;
		this.color = color;
		this.isVerified = isVerified;
		this.adminCreator = adminCreator;
		this.idGroupe = idGroupe;
	}
	save() {
		return db.execute(
			`INSERT INTO students (fullName , email , password ,color,isVerified, adminCreator, idGroupe) VALUES (?,?,?,?,?,?,?) `,
			[
				this.fullName,
				this.email,
				this.password,
				this.color,
				this.isVerified,
				this.adminCreator,
				this.idGroupe,
			]
		);
	}
	static fetchAll() {
		return db.execute("SELECT * FROM students");
	}

	static findByEmailAndPassword(email, password) {
		return db.execute(
			"SELECT * FROM `students` WHERE `email` = ? AND `password` = ?",
			[email, password]
		);
	}
	static findById(id) {
		return db.execute("SELECT * FROM students WHERE `id` = ?  ", [id]);
	}
	static updateUserVerified(isVerified, id) {
		return db.execute(
			`UPDATE students 
              SET isVerified = ?
              WHERE id = ?`,
			[isVerified, id]
		);
	}
}

module.exports = Student;
