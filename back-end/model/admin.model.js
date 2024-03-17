const db = require("../config/database");
const bcrypt = require("bcrypt")
class Admin {
	// constructor
	constructor(fullName, email, password) {
		this.fullName = fullName;
		this.email = email;
		this.password = password;
	}
	async save() {
		// Hash the password before saving
		this.password = await bcrypt.hash(this.password, 12);
		return await db.execute(
			`INSERT INTO admins (fullName , email , password ) VALUES (?,?,?) `,
			[
				this.fullName,
				this.email,
				this.password,
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
