const db = require("../config/database");
class Assignment {
  // constructor
  constructor(name, description, teacherId, moduleId, timeEnd, uploadedLink) {
    this.name = name;
    this.description = description;
    this.teacherId = teacherId;
    this.moduleId = moduleId;
    this.timeEnd = timeEnd || null;
    this.uploadedLink = uploadedLink;
  }
  save() {
    return db.execute(
      `INSERT INTO assignments (name,description,teacherId,moduleId,timeEnd,uploadedLink) VALUES (?,?,?,?,COALESCE(?, timeEnd),?)`,
      [this.name, this.description, this.teacherId, this.moduleId, this.timeEnd, this.uploadedLink]
    );
  }
  static fetchAll(teacherId, moduleId) {
    teacherId = teacherId || null;
    moduleId = moduleId || null;
    return db.execute(
      "SELECT ass.name ,ass.description ,ass.timeEnd,ass.timeBegin,ass.uploadedLink, modules.name AS ModuleName ,modules.semester,teachers.fullName AS TeacherName FROM assignments AS ass LEFT JOIN modules ON ass.moduleId =modules.id  LEFT JOIN teachers ON  teachers.id = ass.teacherId  WHERE  (ass.teacherId  LIKE ? OR ? IS NULL) AND (ass.moduleId = ? OR ? IS NULL)",
      [teacherId, teacherId, moduleId, moduleId]
    );
  }

  static findById(id) {
    return db.execute(
      "SELECT ass.name ,ass.description ,ass.timeEnd,ass.timeBegin,modules.name AS ModuleName ,modules.semester,teachers.fullName AS TeacherName FROM assignments AS ass LEFT JOIN modules ON ass.moduleId =modules.id  LEFT JOIN teachers ON  teachers.id = ass.teacherId  WHERE ass.id = ?",
      [id]
    );
  }

  static deleteById(id) {
    return db.execute("DELETE FROM  assignments WHERE id = ?", [id]);
  }
  static updateAssignment(id, name, description, moduleId, endTime) {
    name = name || null;
    endTime = endTime || null;
    description = description || null;
    moduleId = moduleId || null;
    return db.execute(
      "UPDATE assignments SET name = IFNULL(?, name),  timeEnd = IFNULL(?, timeEnd),description = IFNULL(?, description) ,moduleId = IFNULL(?, moduleId) WHERE id = ?",
      [name, endTime, description, moduleId, id]
    );
  }
}

module.exports = Assignment;
