const db = require("../config/database");
class Result {
  // constructor
  constructor(quizId, studentId, score) {
    this.quizId = quizId;
    this.studentId = studentId;
    this.score = score;
  }
  save() {
    return db.execute(
      `INSERT INTO results (quizId,studentId,score) VALUES (?,?,?) `,
      [this.quizId, this.studentId, this.score]
    );
  }

  static findById(id) {
    return db.execute("SELECT * FROM results  WHERE id = ?", [id]);
  }

  static deleteById(id) {
    return db.execute("DELETE FROM  results WHERE id = ?", [id]);
  }

  static async getPassedStudents(quizId) {
    return db.execute(
      `
		SELECT studentId, score
		FROM results
		WHERE quizId = ?
	  `,
      [quizId]
    );
  }
}

module.exports = Result;
