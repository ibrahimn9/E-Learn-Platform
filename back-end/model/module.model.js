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

  static getTeachersFromModuleId(idModule) {
    return db.execute(
      "SELECT idTeacher FROM  module_teacher_association WHERE (module_teacher_association.idModule = ?)",
      [idModule]
    );
  }

  
  static getModulesOfTeacher(teacherId){
		return db.execute(`SELECT m.*
			FROM modules m
			INNER JOIN module_teacher_association mta ON m.id = mta.idModule
			WHERE mta.idTeacher = ?`,[teacherId]);
	}

  static fetchAll(name, idEditor, idClass, semester) {
    // Check if name ,idEditor , semester is null
    name = name ? `%${name}%` : null;
    idEditor = idEditor || null;
    semester = semester || null;
    // Check if idClass is null
    if (idClass) {
      return db.execute(
        "SELECT modules.id, modules.idEditor, modules.name,modules.semester,modules.description,classes.id AS classId FROM modules  LEFT JOIN class_module_association ON modules.id =class_module_association.idModule  LEFT JOIN classes ON  class_module_association.idClass = classes.id  WHERE class_module_association.idClass = ? AND (modules.name LIKE ? OR ? IS NULL) AND (modules.idEditor = ? OR ? IS NULL) AND (modules.semester = ? OR ? IS NULL)",
        [idClass, name, name, idEditor, idEditor, semester, semester]
      );
    } else {
      return db.execute(
        "SELECT modules.id, modules.idEditor, modules.name,modules.semester,modules.description,classes.id AS classId FROM modules LEFT JOIN class_module_association ON modules.id =class_module_association.idModule  LEFT JOIN classes ON  class_module_association.idClass = classes.id  WHERE  (modules.name  LIKE ? OR ? IS NULL) AND (modules.idEditor = ? OR ? IS NULL) AND (modules.semester = ? OR ? IS NULL)",
        [name, name, idEditor, idEditor, semester, semester]
      );
    }
  }
  static findById(id) {
    return db.execute(
      "SELECT modules.id, modules.idEditor, modules.name,modules.semester,modules.description,classes.id AS classId FROM modules  LEFT JOIN class_module_association ON modules.id =class_module_association.idModule  LEFT JOIN classes ON  class_module_association.idClass = classes.id WHERE modules.id = ? ",
      [id]
    );
  }
  static getAll(){
    return db.execute(`
    SELECT * FROM modules
    `);
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
