const db = require("../config/database");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt")
class Admin {
	// constructor
	constructor(fullName, email, password, color, isVerified) {
		this.fullName = fullName;
		this.email = email;
		this.password = password;
		this.color = color;
		this.isVerified = isVerified || false;
	}
	async save() {
		// Hash the password before saving
		this.password = await bcrypt.hash(this.password, 12);
		return db.execute(
			`INSERT INTO admins (id,fullName , email , password ,color , isVerified) VALUES (?,?,?,?,?,?) `,
			[
				uuidv4(),
				this.fullName,
				this.email,
				this.password,
				this.color,
				this.isVerified,
			]
		);
	}
	static fetchAll() {
		return db.execute("SELECT * FROM admins");
	}

	static findByEmail(email) {
		return db.execute("SELECT * FROM `admins` WHERE `email` = ?", [email]);
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
