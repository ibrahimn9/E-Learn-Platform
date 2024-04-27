const db = require("../config/database");
class Resource {
	// constructor
	constructor(description, type, file, idModule) {
		this.description = description;
		this.type = type;
		this.file = file;
		this.idModule = idModule;
	}
	save() {
		return db.execute(
			`INSERT INTO ressources (description,type,file,idModule) VALUES (?,?,?,?) `,
			[this.description, this.type, this.file, this.idModule]
		);
	}
	static fetchAll(description, type) {
		description = description ? `%${description}%` : null;
		type = type || null;
		return db.execute(
			"SELECT ressources.id , ressources.description,ressources.type ,ressources.file, modules.name , modules.semester , teachers.fullName FROM ressources LEFT JOIN modules ON modules.id = ressources.idModule LEFT JOIN teachers ON teachers.id = modules.idEditor WHERE  (ressources.type  LIKE ? OR ? IS NULL) AND (ressources.description LIKE ? OR ? IS NULL) ",
			[type, type, description, description]
		);
	}
	static findById(id) {
		return db.execute(
			"SELECT ressources.id , ressources.type,ressources.description ,ressources.file, modules.name , modules.semester , teachers.fullName FROM ressources LEFT JOIN modules ON modules.id = ressources.idModule LEFT JOIN teachers ON teachers.id = modules.idEditor  WHERE ressources.id = ?",
			[id]
		);
	}
	static updateResource(description, link, id) {
		description = description || null
		link = link || null
		return db.execute(
			"UPDATE ressources SET description = IFNULL(?, description),  file = IFNULL(?, file) WHERE id = ?",
			[description, link, id]
		);
	}
	static deleteById(id) {
		return db.execute("DELETE FROM  ressources WHERE id = ?", [id]);
	}
}

module.exports = Resource;
