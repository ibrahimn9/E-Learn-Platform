const db = require("../config/database");
class Question {
	// constructor
	constructor(quizId, questionText, note) {
		this.quizId = quizId;
		this.questionText = questionText;
		this.note = note;
	}
	save() {
		return db.execute(
			`INSERT INTO questions (note,quizId,questionText) VALUES (?,?,?) `,
			[this.note, this.quizId, this.questionText]
		);
	}

	static findById(id) {
		return db.execute("SELECT * FROM questions  WHERE id = ?", [id]);
	}

	static deleteById(id) {
		return db.execute("DELETE FROM  questions WHERE id = ?", [id]);
	}
	static findQuestionsByQuiz(id) {
		return db.execute(
			"SELECT questionText , note , id FROM questions WHERE quizId = ?",
			[id]
		);
	}
	static getQuestionsIdsAndNote(id) {
		return db.execute("SELECT  id,note FROM questions WHERE quizId = ?", [id]);
	}
	static findOptions(idQuestion) {
		return db.execute(
			"SELECT o.optionText , o.id FROM questions AS q LEFT JOIN options AS o ON o.questionId = q.id WHERE  q.id = ?",
			[idQuestion]
		);
	}

	static updateQuestion(id, note, text) {
		note = note || null;
		text = text || null;
		return db.execute(
			"UPDATE questions SET note = IFNULL(?, note),  questionText = IFNULL(?, questionText)WHERE id = ?",
			[note, text, id]
		);
	}
}

module.exports = Question;
