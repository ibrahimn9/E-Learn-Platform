const db = require("../config/database");
class Class {
	// constructor
	constructor(name, specialty) {
		this.name = name;
		this.specialty = specialty;
	}
	save() {
		return db.execute(`INSERT INTO classes (name,specialty) VALUES (?,?) `, [
			this.name,
			this.specialty,
		]);
	}
	static fetchAll() {
		return db.execute("SELECT * FROM classes");
	}
	static findByName(name, specialty) {
		// Check if groupeNumber is null or undefined, and set it to NULL if it is
		specialty = specialty || null;
		return db.execute(
			"SELECT * FROM classes WHERE `name` = ?  AND (specialty = ? OR ? IS NULL )",
			[name, specialty, specialty]
		);
	}
}

module.exports = Class;
