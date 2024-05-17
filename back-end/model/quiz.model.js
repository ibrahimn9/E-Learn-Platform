const db = require("../config/database");
class Quiz {
	// constructor
	constructor(name, idTeacher, idModule, timeEnd, duration) {
		this.name = name;
		this.idTeacher = idTeacher;
		this.idModule = idModule;
		this.timeEnd = timeEnd || null;
		this.duration = duration || null;
	}
	async save() {
		return db.execute(
			`INSERT INTO quizzes (quizName,teacherId,duration,timeEnd,moduleId) VALUES ( ?,?,COALESCE(?, duration),COALESCE(?, timeEnd),?) `,
			[this.name, this.idTeacher, this.duration, this.timeEnd, this.idModule]
		);
	}
	static fetchAll(name) {
		name = name ? `%${name}%` : null;
		return db.execute(
			"SELECT * FROM quizzes WHERE quizName LIKE ? OR ? IS NULL",
			[name, name]
		);
	}
	static getStudentQuiz(id) {
		return db.execute(
			"SELECT q.quizName , q.moduleId ,q.teacherId,q.timeBegin, q.timeEnd,q.duration,sq.quizTaken FROM quizzes AS q LEFT JOIN student_quizzes AS sq ON sq.quizId = q.id WHERE sq.studentId = ? ",
			[id]
		);
	}
	static findById(id) {
		return db.execute("SELECT * FROM quizzes  WHERE id = ?", [id]);
	}
	static updateQuiz(id, quizName, duration, endTime) {
		quizName = quizName || null;
		endTime = endTime || null;
		duration = duration || null;
		return db.execute(
			"UPDATE quizzes SET quizName = IFNULL(?, quizName),  timeEnd = IFNULL(?, timeEnd),duration = IFNULL(?, duration) WHERE id = ?",
			[quizName, endTime, duration, id]
		);
	}
	static findByIdModule(id) {
		return db.execute(
			"SELECT * FROM quizzes WHERE moduleId = ? ORDER BY timeBegin DESC",
			[id]
		);
	}
	static findByIdTeacher(id) {
		return db.execute(
			"SELECT * FROM quizzes WHERE teacherId = ? ORDER BY timeBegin DESC",
			[id]
		);
	}
	static deleteById(id) {
		return db.execute("DELETE FROM  quizzes WHERE id = ?", [id]);
	}
	static getScoreTotal(id) {
		return db.execute(
			"SELECT sum(qu.note) AS score_total FROM quizzes AS q LEFT JOIN questions AS qu ON q.id = qu.quizId WHERE q.id = ?",
			[id]
		);
	}
	static getUsersResults(id) {
		return db.execute(
			"SELECT s.fullName AS StudentName , r.score ,q.quizName , m.name,t.fullName AS TeacherName FROM quizzes AS q LEFT JOIN modules AS m ON m.id = q.moduleId LEFT JOIN teachers AS t ON t.id = q.teacherId LEFT JOIN results AS r ON q.id = r.quizId LEFT JOIN students AS s ON s.id = r.studentId  WHERE q.id = ? ORDER BY r.score DESC",
			[id]
		);
	}
}

module.exports = Quiz;
