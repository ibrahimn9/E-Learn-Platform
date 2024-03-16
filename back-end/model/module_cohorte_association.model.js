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

