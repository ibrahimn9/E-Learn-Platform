const db = require("../config/database");
class Submission {
  // constructor
  constructor(assignmentId, studentId, taken, submitLink) {
    this.assignmentId = assignmentId;
    this.studentId = studentId;
    this.taken = taken;
    this.submitLink = submitLink;
  }
  save() {
    return db.execute(
      `INSERT INTO submission (assignmentId,studentId,taken,submitLink) VALUES (?,?,?,?) `,
      [this.assignmentId, this.studentId, this.taken, this.submitLink]
    );
  }

  static findByAssignmentId(id) {
    return db.execute(
      "SELECT * FROM submission  WHERE submission.assignmentId = ? LEFT JOIN students ON students.id = submission.studentId",
      [id]
    );
  }
  static findByStudentId(id) {
    return db.execute(
      "SELECT submission.studentId, submission.assignmentId, submission.taken, submission.submitLink, s.fullname, s.email, c.groupeNumber, r.status FROM submission LEFT JOIN students AS s ON s.id = submission.studentId LEFT JOIN cohorts AS c ON c.id = s.idCohorte LEFT JOIN assignmentresult AS r ON r.assignmentId = submission.assignmentId",
      [id]
    );
  }
  static findByAssignmentId(id) {
    return db.execute(
      "SELECT ass.name,ass.description,ass.timeBegin,ass.timeEnd,s.fullName,submission.taken FROM submission LEFT JOIN students AS s ON s.id = submission.studentId LEFT JOIN assignments AS ass ON submission.assignmentId = ass.id  WHERE submission.assignmentId = ? ",
      [id]
    );
  }
  static findByStudentIdAndAssignmentId(id1, id2) {
    return db.execute(
      "SELECT * FROM submission AS s WHERE s.studentId = ? And s.assignmentId = ?",
      [id2, id1]
    );
  }
}

module.exports = Submission;
