const db = require("../config/database");
class ModuleTeacherAssociation {
  constructor(idModule, idTeacher) {
    this.idModule = idModule;
    this.idTeacher = idTeacher;
  }
  save() {
    return db.execute(
      `INSERT INTO module_teacher_association (idTeacher,idModule) VALUES (?,?) `,
      [this.idTeacher, this.idModule]
    );
  }
  static fetchAll() {
    return db.execute("SELECT * FROM module_teacher_association");
  }
  static deleteByIdModule(id) {
    return db.execute(
      "DELETE FROM module_teacher_association WHERE idModule = ?",
      [id]
    );
  }
  static deleteByIdModuleAndTeacherId(idModule, idTeacher) {
    return db.execute(
      "DELETE FROM module_teacher_association WHERE idModule = ? AND idTeacher = ?",
      [idModule, idTeacher]
    );
  }
  static deleteTeachers(id) {
    return db.execute(
      "DELETE FROM module_teacher_association WHERE idModule = ?",
      [id]
    );
  }
}

module.exports = ModuleTeacherAssociation;
