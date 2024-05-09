const db = require("../config/database");
class Cohort {
  // constructor
  constructor(groupeNumber, idClass, adminCreator) {
    this.groupeNumber = groupeNumber;
    this.idClass = idClass;
    this.adminCreator = adminCreator;
  }
  save() {
    return db.execute(
      `INSERT INTO cohorts (groupeNumber, idClass, adminCreator) VALUES (?,?,?) `,
      [this.groupeNumber, this.idClass, this.adminCreator]
    );
  }
  static findWithId(id) {
    return db.execute("SELECT * FROM cohorts WHERE id = ?", [id]);
  }
  static findById(id, idAdmin) {
    return db.execute(
      "SELECT cohorts.id , cohorts.groupeNumber ,cohorts.adminCreator ,classes.name , classes.speciality FROM cohorts LEFT JOIN classes ON cohorts.idClass = classes.id WHERE cohorts.id = ? AND cohorts.adminCreator = ? ",
      [id, idAdmin]
    );
  }
  static findByGroupeNumber(groupeNumber) {
    return db.execute("SELECT * FROM cohorts WHERE groupeNumber=?", [
      groupeNumber,
    ]);
  }
  static fetchAll(idClass, groupeNumber, adminCreator) {
    // Check if idClass is null or undefined, and set it to NULL if it is
    idClass = idClass || null;

    // Check if groupeNumber is null or undefined, and set it to NULL if it is
    groupeNumber = groupeNumber || null;
    return db.execute(
      "SELECT cohorts.id , cohorts.groupeNumber ,cohorts.adminCreator ,classes.name , classes.speciality FROM cohorts LEFT JOIN classes ON cohorts.idClass = classes.id WHERE (cohorts.idClass = ? OR ? IS NULL) AND (cohorts.groupeNumber = ? OR ? IS NULL ) AND (cohorts.adminCreator = ? )",
      [idClass, idClass, groupeNumber, groupeNumber, adminCreator]
    );
  }
  static getTeachersFromCohortId(idCohort) {
    return db.execute(
      "SELECT idTeacher FROM  cohorte_teacher_association WHERE (cohorte_teacher_association.idCohorte = ?)",
      [idCohort]
    );
  }
  static fetchModulesWithinClass(idClass) {
    return db.execute(
      "SELECT idModule FROM cohorts LEFT JOIN class_module_association ON cohorts.idClass = class_module_association.idClass WHERE cohorts.idClass = ?",
      [idClass]
    );
  }
  static deleteById(id) {
    return db.execute("DELETE FROM cohorts WHERE id = ?", [id]);
  }
  static findByClassId(id) {
    return db.execute("SELECT id FROM cohorts WHERE idClass = ? ", [id]);
  }
  static async getCohortIdByClassAndGroupNumber(idClass, groupeNumber) {
    return await db.execute(
      "SELECT id FROM cohorts WHERE idClass = ? AND groupeNumber = ?",
      [idClass, groupeNumber]
    );
  }
  static async updateGroupNumber(cohortId, newGroupNumber) {
    return await db.execute(
      "UPDATE cohorts SET groupeNumber = ? WHERE id = ?",
      [newGroupNumber, cohortId]
    );
  }
}

module.exports = Cohort;
