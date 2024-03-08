const db = require("../config/database");
class Class {
	// constructor
	constructor(name,specialty) {
		this.name = name;
		this.specialty= specialty
	}
	save() {
		return db.execute(`INSERT INTO classes (name,specialty) VALUES (?,?) `, [this.name , this.specialty]);
	}
	static fetchAll() {
		return db.execute("SELECT * FROM classes");
	}
	static findByName(name) {
		return db.execute("SELECT * FROM classes WHERE `name` = ? ", [name]);
	}
}


module.exports = Class