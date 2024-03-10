const db = require("../config/database");
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
	static findByToken(token) {
		return db.execute(`SELECT * FROM verificationToken WHERE token=? `, [token]);
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
	static findByUserIdAndRole(userId, role) {
		return db.execute(
			"SELECT * FROM verificationToken WHERE `idUser` = ? AND `role`=?",
			[userId, role]
		);
	}
}

module.exports = VerificationToken;
