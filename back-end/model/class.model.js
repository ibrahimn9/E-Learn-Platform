import db from "../config/database.js";

export default class Class {
	// constructor
	constructor(name) {
		this.name = name;
	}
	save() {
		return db.execute(`INSERT INTO classes (name) VALUES (?) `, [this.name]);
	}
	static fetchAll() {
		return db.execute("SELECT * FROM classes");
	}
	static findByName(name) {
		return db.execute("SELECT * FROM classes WHERE classes.name = ? ", [name]);
	}
}
