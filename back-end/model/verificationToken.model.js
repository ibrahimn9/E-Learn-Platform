const db = require("../config/database");
const { v4: uuidv4 } = require("uuid");
class VerificationToken {
	// constructor
	constructor(idUser, token, role) {
		this.idUser = idUser;
		this.token = token;
		this.role = role;
	}
	save() {
		return db.execute(
			`INSERT INTO verificationToken (id,idUser, token ,role) VALUES (?,?,?) `,
			[uuidv4(), this.idUser, this.token, this.role]
		);
	}
	static deleteById(id) {
		return db.execute(`DELETE FROM verificationToken WHERE id=? `, [id]);
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
