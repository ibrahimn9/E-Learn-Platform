const db = require("../config/database");

class CohorteTeacherAssociation {
    constructor(idTeacher, idCohorte) {
        this.idTeacher = idTeacher;
        this.idCohorte = idCohorte;
    }

    save() {
        return db.execute(
            `INSERT INTO cohorte_teacher_association (idTeacher, idCohorte) VALUES (?, ?)`,
            [this.idTeacher, this.idCohorte]
        );
    }

    static fetchAll() {
        return db.execute("SELECT * FROM cohorte_teacher_association");
    }
}

module.exports = CohorteTeacherAssociation;
