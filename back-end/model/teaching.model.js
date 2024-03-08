import db from "../config/database.js";

export default class Teaching {
	// constructor
	constructor(idTeacher, idModule) {
		this.idTeacher = idTeacher;
		this.idModule = idModule;
	}
	save() {
		return db.execute(
			`INSERT INTO classes (idTeacher, idModule) VALUES (?,?) `,
			[this.idTeacher, this.idModule]
		);
	}
	static fetchAll() {
		return db.execute("SELECT * FROM classes");
	}
}
