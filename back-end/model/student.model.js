import db from "../config/database.js";

export default class Student {
	// constructor
	constructor(fullName, email, password, color, adminCreator, idGroupe) {
		this.fullName = fullName;
		this.email = email;
		this.password = password;
		this.color = color;
		this.adminCreator = adminCreator;
		this.idGroupe = idGroupe;
	}
	save() {
		return db.execute(
			`INSERT INTO students (fullName , email , password ,color, adminCreator, idGroupe) VALUES (?,?,?,?.?,?) `,
			[
				this.fullName,
				this.email,
				this.password,
				this.color,
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
			`SELECT * FROM students WHERE students.email = ? AND students.password = ?`,
			[email, password]
		);
	}
}
