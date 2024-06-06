const db = require("../config/database");
class File {
	// constructor
	constructor(studentId, assignmentId, fileName, fileUrl, fileType) {
		this.studentId = studentId || null;
		this.assignmentId = assignmentId;
		this.fileName = fileName;
		this.fileUrl = fileUrl;
		this.fileType = fileType;
	}
	save() {
		console.log(
			this.fileType,
			this.fileName,
			this.assignmentId,
			this.fileUrl,
			this.studentId
		);
		return db.execute(
			`INSERT INTO file (fileType, assignmentId, fileName, fileUrl, studentId) VALUES (?, ?, ?, ?, ?)`,
			[
				this.fileType,
				this.assignmentId,
				this.fileName,
				this.fileUrl,
				this.studentId ? this.studentId : null, // Use null if studentId is not provided
			]
		);
	}

	static findById(id) {
		return db.execute("SELECT * FROM file  WHERE id = ?", [id]);
	}

	static deleteById(id) {
		return db.execute("DELETE FROM  file WHERE id = ?", [id]);
	}
}

module.exports = File;