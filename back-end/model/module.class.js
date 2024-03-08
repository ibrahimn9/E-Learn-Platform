import db from "../config/database.js";

export default class Module {
	// constructor
	constructor(name, semester, description, Specialty, idAdmin) {
		this.name = name;
		this.semester = semester;
		this.description = description;
		this.Specialty = Specialty;
		this.idAdmin = idAdmin;
	}
	save() {
		return db.execute(
			`INSERT INTO modules (name, semester, description, Specialty, idAdmin) VALUES (?,?,?,?) `,
			[this.name, this.semester, this.description, this.Specialty, this.idAdmin]
		);
	}
	static fetchAll() {
		return db.execute("SELECT * FROM modules");
	}
}
