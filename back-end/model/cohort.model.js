const db = require("../config/database");
class Cohort {
	// constructor
	constructor(groupeNumber, totalMember, idClass, adminCreator) {
		this.groupeNumber = groupeNumber;
		this.totalMember = totalMember;
		this.idClass = idClass;
		this.adminCreator = adminCreator;
	}
	async save() {
		return await db.execute(
			`INSERT INTO cohortes (groupeNumber, totalMember, idClass, adminCreator) VALUES (?,?,?,?) `,
			[
				this.groupeNumber,
				this.totalMember,
				this.idClass,
				this.adminCreator,
			]
		);
	}
	static  async fetchAll() {
		return await db.execute("SELECT * FROM cohorts");
	}
	static async getCohortIdByClassAndGroupNumber(idClass, groupeNumber) {
		return await db.execute(
			"SELECT id FROM cohortes WHERE idClass = ? AND groupeNumber = ?",
			[idClass, groupeNumber]
		);
	}

}

module.exports = Cohort;
