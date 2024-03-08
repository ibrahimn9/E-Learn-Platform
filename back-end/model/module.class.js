const db = require("../config/database");
class Module {
	// constructor
	constructor(name, semester, description, idEditor) {
		this.name = name;
		this.semester = semester;
		this.description = description;
		this.idEditor = idEditor;
	}
	save() {
		return db.execute(
			`INSERT INTO modules (name, semester, description, idEditor) VALUES (?,?,?,?) `,
			[
				this.name,
				this.semester,
				this.description,
				this.idEditor,
			]
		);
	}
	static fetchAll() {
		return db.execute("SELECT * FROM modules");
	}
}

module.exports = Module;
