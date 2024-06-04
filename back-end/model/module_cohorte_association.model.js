const db = require("../config/database");

class ModuleCohorteAssociation {
	constructor(idCohorte, idModule) {
		this.idCohorte = idCohorte;
		this.idModule = idModule;
	}
	save() {
		return db.execute(
			`INSERT INTO module_cohorte_association (idModule,idCohorte) VALUES (?,?) `,
			[this.idModule, this.idCohorte]
		);
	}
	static fetchAll() {
		return db.execute("SELECT * FROM module_cohorte_association");
	}
	static deleteByIdModule(id) {
		return db.execute(
			"DELETE FROM module_cohorte_association WHERE idModule = ?",
			[id]
		);
	}
	static getStudentIds(idModule) {
		return db.execute(
			"SELECT st.id FROM module_cohorte_association AS moCohort LEFT JOIN students AS st ON st.idCohorte=moCohort.idCohorte WHERE moCohort.idModule = ? ",
			[idModule]
		);
	}
}

module.exports = ModuleCohorteAssociation;
