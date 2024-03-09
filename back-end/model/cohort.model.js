const db = require("../config/database");
const { v4: uuidv4 } = require("uuid");
class Cohort {
	// constructor
	constructor(groupeNumber, totalMember, idClass, adminCreator) {
		this.groupeNumber = groupeNumber;
		this.totalMember = totalMember;
		this.idClass = idClass;
		this.adminCreator = adminCreator;
	}
	save() {
		return db.execute(
			`INSERT INTO cohorts (id,groupeNumber, totalMember, idClass, adminCreator) VALUES (?,?,?,?,?) `,
			[
				uuidv4(),
				this.groupeNumber,
				this.totalMember,
				this.idClass,
				this.adminCreator,
			]
		);
	}
	static fetchAll() {
		return db.execute("SELECT * FROM cohorts");
	}
}

module.exports = Cohort;
