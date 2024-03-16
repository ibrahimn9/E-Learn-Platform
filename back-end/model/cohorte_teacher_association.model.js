const db = require("../config/database");


class CohorteTeacherAssociation {
	constructor(idTeacher, idCohorte) {
		this.idTeacher = idTeacher;
		this.idCohorte = idCohorte;
	}
	save() {
		return db.execute(
			`INSERT INTO cohorte_teacher_association (idTeacher,idCohort) VALUES (?,?) `,
			[this.idTeacher, this.idCohorte]
		);
	}
	static fetchAll() {
		return db.execute("SELECT * FROM cohorte_teacher_association");
	}
	static deleteByIdCohort(id) {
		return db.execute(
			"DELETE FROM cohorte_teacher_association WHERE idCohort = ?",
			[id]
		);
	}
}

module.exports = CohorteTeacherAssociation;
