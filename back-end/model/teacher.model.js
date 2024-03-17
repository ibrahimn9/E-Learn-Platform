const db = require("../config/database");
const bcrypt = require("bcrypt");
class Teacher {
	// constructor
	constructor(fullName, email, password, adminCreator) {
		this.fullName = fullName;
		this.email = email;
		this.password = password;
		this.adminCreator = adminCreator;
	}
	async save() {
		// Hash the password before saving
		this.password = await bcrypt.hash(this.password, 12);
		return await db.execute(
			`INSERT INTO teachers (fullName , email , password  , adminCreator) VALUES (?,?,?,?) `,
			[
				this.fullName,
				this.email,
				this.password,
				this.adminCreator,
			]
		);
	}
	static fetchAll() {
		return db.execute("SELECT * FROM teachers");
	}

	static searchByNameOrEmail(email) {
		return db.execute(
			"SELECT * FROM teachers WHERE email = ? OR fullName = ?",
			[email, email]
		);
	}
	static findByEmail(email) {
		return db.execute("SELECT * FROM `teachers` WHERE `email` = ?", [email]);
	}
	static findById(id) {
		return db.execute("SELECT * FROM teachers WHERE `id` = ?", [id]);
	}
	static findByIdWithinAdmin(id, idAdmin) {
		return db.execute(
			"SELECT * FROM teachers WHERE `id` = ? AND adminCreator = ? ",
			[id, idAdmin]
		);
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
	static findByNameOrEmail(name, email, adminCreator) {
		// Adjust input parameters to handle partial values
		name = name ? `%${name}%` : null;
		email = email ? `%${email}%` : null;

		return db.execute(
			"SELECT * FROM teachers WHERE (fullName LIKE ? OR ? IS NULL) AND (email LIKE ? OR ? IS NULL) AND adminCreator = ?",
			[name, name, email, email, adminCreator]
		);
	}
}

module.exports = Teacher;
