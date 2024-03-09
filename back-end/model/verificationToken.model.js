const db = require("../config/database")

class VerificationToken {
	// constructor
	constructor(idUser, token, role) {
		this.idUser = idUser;
		this.token = token;
		this.role = role;
	}
	save() {
		return db.execute(
			`INSERT INTO verificationToken (idUser, token ,role) VALUES (?,?,?) `,
			[this.idUser, this.token, this.role]
		);
	}
	static deleteById(id) {
		return db.execute(`DELETE FROM verificationToken WHERE id=? `, [id]);
	}
	static findByToken(id) {
		return db.execute(`SELECT * FROM verificationToken WHERE token=? `, [id]);
	}
	static fetchAll() {
		return db.execute("SELECT * FROM verificationToken");
	}
	static findOne(userId, token) {
		return db.execute(
			"SELECT * FROM verificationToken WHERE `idUser` = ? AND `token`=?",
			[userId, token]
		);
	}
}


module.exports = VerificationToken;