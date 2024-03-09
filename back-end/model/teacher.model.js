const db = require("../config/database")
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt")
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
	async save() {
		// Hash the password before saving
		this.password = await bcrypt.hash(this.password, 12);
		return db.execute(
			`INSERT INTO teachers (id,fullName , email , password ,color,isVerified , adminCreator) VALUES (?,?,?,?,?,?,?) `,
			[
				uuidv4(),
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

	static findByEmail(email) {
		return db.execute("SELECT * FROM `teachers` WHERE `email` = ?", [email]);
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
}

module.exports = Teacher;