const db = require("../config/database.js");
const { v4: uuidv4 } = require("uuid");
class Teaching {
	// constructor
	constructor(idTeacher, idModule) {
		this.idTeacher = idTeacher;
		this.idModule = idModule;
	}
	save() {
		return db.execute(
			`INSERT INTO classes (id,idTeacher, idModule) VALUES (?,?,?) `,
			[uuidv4(),this.idTeacher, this.idModule]
		);
	}
	static fetchAll() {
		return db.execute("SELECT * FROM classes");
	}
}

module.exports = Teaching;
