const db = require("../config/database");
const bcrypt = require("bcrypt");
class Student {
	// constructor
	constructor(
		fullName,
		email,
		password,
		adminCreator,
		idCohorte
	) {
		this.fullName = fullName;
		this.email = email;
		this.password = password;
		this.adminCreator = adminCreator;
		this.idCohorte = idCohorte;
	}
	async save() {
		// Hash the password before saving
		this.password = await bcrypt.hash(this.password, 12);
		return await db.execute(
			`INSERT INTO students (fullName , email , password , adminCreator, idCohorte) VALUES (?,?,?,?,?) `,
			[
				this.fullName,
				this.email,
				this.password,
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
	static findByIdWithinAdmin(id, idAdmin) {
		return db.execute(
			"SELECT * FROM students WHERE `id` = ? AND adminCreator = ? ",
			[id, idAdmin]
		);
	}
	static findById(id) {
		return db.execute("SELECT * FROM students WHERE `id` = ?", [id]);
	}
	static updateUserVerified(isVerified, id) {
		return db.execute(
			`UPDATE students 
              SET isVerified = ?
              WHERE id = ?`,
			[isVerified, id]
		);
	}
	static updatePassword(password, id) {
		return db.execute(
			`UPDATE students 
              SET password = ?
              WHERE id = ?`,
			[password, id]
		);
	}
	static findByNameOrEmail(name, email, adminCreator) {
		// Adjust input parameters to handle partial values
		name = name ? `%${name}%` : null;
		email = email ? `%${email}%` : null;

		return db.execute(
			"SELECT * FROM students WHERE (fullName LIKE ? OR ? IS NULL) AND (email LIKE ? OR ? IS NULL) AND adminCreator = ?",
			[name, name, email, email, adminCreator]
		);
	}
}

module.exports = Student;
