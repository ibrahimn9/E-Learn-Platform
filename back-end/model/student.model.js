const db = require("../config/database");
const bcrypt = require("bcrypt");
class Student {
	// constructor
	constructor(
		fullName,
		email,
		password,
		color,
		isVerified,
		adminCreator,
		idCohorte
	) {
		this.fullName = fullName;
		this.email = email;
		this.password = password;
		this.color = color;
		this.isVerified = isVerified || false;
		this.adminCreator = adminCreator;
		this.idCohorte = idCohorte;
	}
	async save() {
		// Hash the password before saving
		this.password = await bcrypt.hash(this.password, 12);
		return db.execute(
			`INSERT INTO students (fullName , email , password ,color,isVerified, adminCreator, idCohorte) VALUES (?,?,?,?,?,?,?) `,
			[
				this.fullName,
				this.email,
				this.password,
				this.color,
				this.isVerified,
				this.adminCreator,
				this.idCohorte,
			]
		);
	}
	static fetchAll() {
		return db.execute("SELECT * FROM students");
	}

	static findByEmail(email) {
		return db.execute("SELECT * FROM `students` WHERE `email` = ?", [email]);
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
	static updatePassword(password,id) {
		return db.execute(
			`UPDATE students 
              SET password = ?
              WHERE id = ?`,
			[password, id]
		);
	}
}

module.exports = Student;
