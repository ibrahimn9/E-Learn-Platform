const db = require("../config/database.js");
class Teaching {
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

module.exports = Teaching;
