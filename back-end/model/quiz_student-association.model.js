const db = require("../config/database");
class student_quizzes {
	// constructor
	constructor(studentId, quizId) {
		this.studentId = studentId;
		this.quizId = quizId;
	}
	async save() {
		return db.execute(
			`INSERT INTO student_quizzes (studentId,quizId) VALUES (?,?) `,
			[this.studentId, this.quizId]
		);
	}

	static findById(id) {
		return db.execute("SELECT * FROM student_quizzes  WHERE id = ?", [id]);
	}

	static deleteById(id) {
		return db.execute("DELETE FROM  student_quizzes WHERE id = ?", [id]);
	}
	static setQuiz(id, studentId) {
		return db.execute(
			"UPDATE student_quizzes SET quizTaken  = true WHERE quizId = ? AND studentId = ? ",
			[id, studentId]
		);
	}
}

module.exports = student_quizzes;
