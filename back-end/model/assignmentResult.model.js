const db = require("../config/database");
class AssignmentResult {
	// constructor
	constructor(assignmentId, studentId, status) {
		this.assignmentId = assignmentId;
		this.studentId = studentId;
		this.status = status;
	}
	save() {
		return db.execute(
			`INSERT INTO assignmentResult (assignmentId,studentId,status) VALUES (?,?,?,?) `,
			[this.assignmentId, this.studentId, this.status]
		);
	}

	static findById(id) {
		return db.execute("SELECT * FROM assignmentResult  WHERE id = ?", [id]);
	}

	static deleteById(id) {
		return db.execute("DELETE FROM  assignmentResult WHERE id = ?", [id]);
	}
	static findByAssignmentId(id) {
		return db.execute(
			"SELECT ar.status,ass.name,ass.description,ass.timeBegin,ass.timeEnd,s.fullName FROM assignmentResult AS ar LEFT JOIN students AS s ON s.id = ar.studentId LEFT JOIN assignments AS ass ON ar.assignmentId = ass.id  WHERE ar.assignmentId = ? ",
			[id]
		);
	}
}

module.exports = AssignmentResult;