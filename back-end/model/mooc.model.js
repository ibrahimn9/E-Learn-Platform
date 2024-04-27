const db = require("../config/database");
class Mooc {
	// constructor
	constructor(title, description, link, idModule) {
		this.title = title;
		this.description = description;
		this.link = link;
		this.idModule = idModule;
	}
	save() {
		return db.execute(
			`INSERT INTO moocs (title,description,link,idModule) VALUES (?,?,?,?) `,
			[this.title, this.description, this.link, this.idModule]
		);
	}
	static fetchAll(title, description) {
		title = title ? `%${title}%` : null;
		description = description ? `%${description}%` : null;
		return db.execute(
			"SELECT moocs.id , moocs.title,moocs.description ,moocs.link, modules.name , modules.semester , teachers.fullName FROM moocs LEFT JOIN modules ON modules.id = moocs.idModule LEFT JOIN teachers ON teachers.id = modules.idEditor WHERE  (moocs.title  LIKE ? OR ? IS NULL) AND (modules.description = ? OR ? IS NULL) ",
			[title, title, description, description]
		);
	}
	static findById(id) {
		return db.execute(
			"SELECT moocs.id , moocs.title,moocs.description ,moocs.link, modules.name , modules.semester , teachers.fullName FROM moocs LEFT JOIN modules ON modules.id = moocs.idModule LEFT JOIN teachers ON teachers.id = modules.idEditor  WHERE moocs.id = ?",
			[id]
		);
	}
  static fetchByModuleId(id) {
    return db.execute(
			"SELECT moocs.id , moocs.title,moocs.description ,moocs.link, modules.name , modules.semester , teachers.fullName FROM moocs LEFT JOIN modules ON modules.id = moocs.idModule LEFT JOIN teachers ON teachers.id = modules.idEditor  WHERE moocs.idModule = ?",
			[id]
		);
  }

	static updateMooc(title, description, id) {
		description = description || null;
		title = title || null;
		return db.execute(
			"UPDATE moocs SET description = IFNULL(?, description),  title = IFNULL(?, title) WHERE id = ?",
			[description, title, id]
		);
	}

	static deleteById(id) {
		return db.execute("DELETE FROM  moocs WHERE id = ?", [id]);
	}
}

module.exports = Mooc;
