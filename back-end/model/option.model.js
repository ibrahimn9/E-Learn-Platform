const db = require("../config/database");
class Option {
	// constructor
	constructor(questionId, isCorrect, optionText) {
		this.questionId = questionId;
		this.isCorrect = isCorrect;
		this.optionText = optionText;
	}
	save() {
		return db.execute(
			`INSERT INTO options (questionId,isCorrect,optionText) VALUES (?,?,?) `,
			[this.questionId, this.isCorrect, this.optionText]
		);
	}

	static findById(id) {
		return db.execute("SELECT * FROM options  WHERE id = ?", [id]);
	}

	static deleteById(id) {
		return db.execute("DELETE FROM  options WHERE id = ?", [id]);
	}
	static deleteByQuestionId(id) {
		return db.execute("DELETE FROM options WHERE questionId = ?", [id]);
	}
	static getRightOptionsOfQuestion(id) {
		return db.execute(
			"SELECT id FROM options WHERE questionId = ? AND isCorrect = true",
			[id]
		);
	}
}

module.exports = Option;
