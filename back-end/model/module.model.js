const db = require("../config/database");
class Module {
	// constructor
	constructor(name, semester, description, idEditor) {
		this.name = name;
		this.semester = semester;
		this.description = description;
		this.idEditor = idEditor;
	}
	save() {
		return db.execute(
			`INSERT INTO modules (name, semester, description, idEditor ) VALUES (?,?,?,?) `,
			[this.name, this.semester, this.description, this.idEditor]
		);
	}
	static fetchAll(name, idEditor, idClass, semester) {
		// Check if name ,idEditor , semester is null
		name = name || null;
		idEditor = idEditor || null;
		semester = semester || null;
		// Check if idClass is null
		if (idClass) {
			return db.execute(
				"SELECT * FROM modules  LEFT JOIN class_module_association ON modules.id =class_module_association.idModule  LEFT JOIN classes ON  class_module_association.idClass = classes.id  WHERE class_module_association.idClass = ? AND (modules.name = ? OR ? IS NULL) AND (modules.idEditor = ? OR ? IS NULL) AND (modules.semester = ? OR ? IS NULL)",
				[idClass, name, name, idEditor, idEditor, semester, semester]
			);
		} else {
			return db.execute(
				"SELECT * FROM modules WHERE  (modules.name = ? OR ? IS NULL) AND (modules.idEditor = ? OR ? IS NULL) AND (modules.semester = ? OR ? IS NULL)",
				[ name, name, idEditor, idEditor, semester, semester]
			);
		}
	}
	static findById(id) {
		return db.execute("SELECT * FROM modules WHERE id = ? ", [id]);
	}
	static deleteById(id) {
		return db.execute("DELETE FROM modules WHERE id = ?", [id]);
	}
	static updateEditor(name, description, semester, idEditor, id) {
		name = name || null;
		description = description || null;
		idEditor = idEditor || null;
		semester = semester || null;
		return db.execute(
			`UPDATE modules
SET name = CASE WHEN ? IS NULL THEN name ELSE ? END,
    description = CASE WHEN ? IS NULL THEN description ELSE ? END,
    semester = CASE WHEN ? IS NULL THEN semester ELSE ? END,
    idEditor = CASE WHEN ? IS NULL THEN idEditor ELSE ? END
WHERE id = ?;`,
			[
				name,
				name,
				description,
				description,
				semester,
				semester,
				idEditor,
				idEditor,
				id,
			]
		);
	}
	static fetchCohortsByClassIdAndModuleId(idModule, classId) {
		return db.execute(
			"SELECT cohorts.id FROM modules LEFT JOIN class_module_association ON modules.id = class_module_association.idModule LEFT JOIN cohorts ON class_module_association.idClass = cohorts.idClass WHERE modules.id = ? AND  class_module_association.idClass = ? ",
			[idModule, classId]
		);
	}
}

module.exports = Module;
