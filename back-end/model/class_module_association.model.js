const db = require("../config/database");
class ClassModuleAssociation {
	constructor(idModule, idClass) {
		this.idModule = idModule;
		this.idClass = idClass;
	}
	save() {
		return db.execute(
			`INSERT INTO class_module_association (idModule,idClass) VALUES (?,?) `,
			[this.idModule, this.idClass]
		);
	}
	static fetchAll() {
		return db.execute("SELECT * FROM class_module_association");
	}
	static deleteByIdModule(id) {
		return db.execute(
			"DELETE FROM class_module_association WHERE idModule = ?",
			[id]
		);
	}
}

module.exports = ClassModuleAssociation;
