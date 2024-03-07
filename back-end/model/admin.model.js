import db from "../config/database.js";

export default class Admin {
	// constructor
	constructor(fullName, email, password, color) {
		this.fullName = fullName;
		this.email = email;
		this.password = password;
		this.color = color;
	}
	save() {
		return db.execute(
			`INSERT INTO admins (fullName , email , password ,color) VALUES (?,?,?,?) `,
			[this.fullName, this.email, this.password, this.color]
		);
	}
	static fetchAll() {
		return db.execute("SELECT * FROM admins");
	}

	static findByEmailAndPassword(email , password) {
		return db.execute(
			`SELECT * FROM admins WHERE admins.email = ? AND admins.password = ?`,
			[email, password]
		);
	}
}
