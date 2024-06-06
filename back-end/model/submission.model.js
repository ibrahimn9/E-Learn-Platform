const db = require("../config/database");
class Submission {
	// constructor
	constructor(assignmentId, studentId, taken) {
		this.assignmentId = assignmentId;
		this.studentId = studentId;
		this.taken = taken;
	}
	save() {
		return db.execute(
			`INSERT INTO submission (assignmentId,studentId,taken) VALUES (?,?,?) `,
			[this.assignmentId, this.studentId, this.taken]
		);
	}

	static findByAssignmentId(id) {
		return db.execute(
			"SELECT * FROM submission  WHERE submission.assignmentId = ?",
			[id]
		);
	}
	static findByStudentId(id) {
		return db.execute(
			"SELECT ass.name,ass.description,ass.timeBegin,ass.timeEnd,s.fullName,submission.taken FROM submission LEFT JOIN students AS s ON s.id = submission.studentId LEFT JOIN assignments AS ass ON submission.assignmentId = ass.id  WHERE submission.studentId = ? ",
			[id]
		);
	}
	static findByAssignmentId(id) {
		return db.execute(
			"SELECT ass.name,ass.description,ass.timeBegin,ass.timeEnd,s.fullName,submission.taken FROM submission LEFT JOIN students AS s ON s.id = submission.studentId LEFT JOIN assignments AS ass ON submission.assignmentId = ass.id  WHERE submission.assignmentId = ? ",
			[id]
		);
	}
	static findByStudentIdAndAssignmentId(id1, id2) {
		return db.execute(
			"SELECT * FROM submission AS s WHERE s.studentId = ? And s.assignmentId = ?",
			[id2, id1]
		);
	}
}

module.exports = Submission;