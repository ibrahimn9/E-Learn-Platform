const db = require("../config/database");

class ModuleCohorteAssociation {
    constructor(idCohorte, idModule) {
        this.idCohorte = idCohorte;
        this.idModule = idModule;
    }

    save() {
        return db.execute(
            `INSERT INTO module_cohorte_association (idCohorte, idModule) VALUES (?, ?)`,
            [this.idCohorte, this.idModule]
        );
    }

    static fetchAll() {
        return db.execute("SELECT * FROM module_cohorte_association");
    }
}

module.exports = ModuleCohorteAssociation;

class ModuleCohorteAssociation {
	constructor(idCohorte, idModule) {
		this.idCohorte = idCohorte;
		this.idModule = idModule;
	}
	save() {
		return db.execute(
			`INSERT INTO module_cohorte_association (idModule,idCohort) VALUES (?,?) `,
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
}

module.exports = ModuleCohorteAssociation;

