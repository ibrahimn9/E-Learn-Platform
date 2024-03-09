const db = require("../config/database");
const { v4: uuidv4 } = require("uuid");
class Class {
	// constructor
	constructor(name, specialty) {
		this.name = name;
		this.specialty = specialty;
	}
	save() {
		return db.execute(
			`INSERT INTO classes (id,name,specialty) VALUES (?,?,?) `,
			[uuidv4(), this.name, this.specialty]
		);
	}
	static fetchAll() {
		return db.execute("SELECT * FROM classes");
	}
	static findByName(name) {
		return db.execute("SELECT * FROM classes WHERE `name` = ? ", [name]);
	}
}

module.exports = Class;
