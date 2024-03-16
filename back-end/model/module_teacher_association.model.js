const db = require("../config/database");

class ModuleTeacherAssociation {
    constructor(idModule, idTeacher) {
        this.idModule = idModule;
        this.idTeacher = idTeacher;
    }

    save() {
        return db.execute(
            `INSERT INTO module_teacher_association (idModule, idTeacher) VALUES (?, ?)`,
            [this.idModule, this.idTeacher]
        );
    }

    static fetchAll() {
        return db.execute("SELECT * FROM module_teacher_association");
    }
}

module.exports = ModuleTeacherAssociation;
