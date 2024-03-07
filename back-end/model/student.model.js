import db from "../config/database.js";

export default class Student {
  // constructor
  constructor(id, fullName, email, password, isVerified, idCohorte, idAdmin) {
		this.id = id;
		this.fullName = fullName;
		this.email = email;
		this.password = password;
		this.isVerified = isVerified;
		this.idCohorte = idCohorte;
		this.idAdmin = idAdmin;
	}
	save() {
		return db.execute(
			`INSERT INTO students (fullName , email , password ) VALUES (?,?,?) `,
			[this.fullName, this.email, this.password]
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
