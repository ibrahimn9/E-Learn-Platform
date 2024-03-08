import db from "../config/database.js";

export default class Teacher {
	// constructor
	constructor(fullName, email, password, color, adminCreator) {
		this.fullName = fullName;
		this.email = email;
		this.password = password;
		this.color = color;
		this.adminCreator = adminCreator;
	}
	save() {
		return db.execute(
			`INSERT INTO teachers (fullName , email , password ,color- , adminCreator) VALUES (?,?,?,?,?) `,
			[this.fullName, this.email, this.password, this.color, this.adminCreator]
		);
	}
	static fetchAll() {
		return db.execute("SELECT * FROM teachers");
	}

	static findByEmailAndPassword(email, password) {
		return db.execute(
			`SELECT * FROM students WHERE students.email = ? AND students.password = ?`,
			[email, password]
		);
	}
}
