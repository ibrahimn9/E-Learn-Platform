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
	static fetchById(id) {
		return db.execute("SELECT * FROM classes WHERE id = ?", [id]);
	}
	static findByName(name, specialty) {
		// Check if groupeNumber is null or undefined, and set it to NULL if it is
		specialty = specialty || null;
		name = name || null;
		return db.execute(
			"SELECT * FROM classes WHERE (name = ? OR ? IS NULL )  AND (specialty = ? OR ? IS NULL )",
			[name, name, specialty, specialty]
		);
	}
	static updateSpecialty(specialty, id) {
		return db.execute(
			"UPDATE TABLE classes SET COLUMN specialty = ? WHERE id = ?",
			[specialty, id]
		);
	}
	static deleteById(id) {
		return db.execute("DELETE FROM TABLE classes WHERE id = ?", [id]);
	}
}

module.exports = Class;
