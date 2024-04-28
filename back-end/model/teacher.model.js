const db = require("../config/database");
const bcrypt = require("bcrypt");
class Teacher {
  // constructor
  constructor(fullName, email, password, adminCreator) {
    this.fullName = fullName;
    this.email = email;
    this.password = password;
    this.adminCreator = adminCreator;
  }
  async save() {
    // Hash the password before saving
    this.password = await bcrypt.hash(this.password, 12);
    return await db.execute(
      "INSERT INTO teachers (fullName , email , password  , adminCreator) VALUES (?,?,?,?)",
      [this.fullName, this.email, this.password, this.adminCreator]
    );
  }
  static fetchAll() {
    return db.execute("SELECT * FROM teachers");
  }

  static searchByNameOrEmail(email) {
    return db.execute(
      "SELECT * FROM teachers WHERE email = ? OR fullName = ?",
      [email, email]
    );
  }
  static findByEmail(email) {
    return db.execute("SELECT * FROM teachers WHERE email = ?", [email]);
  }
  static findById(id) {
    return db.execute("SELECT * FROM teachers WHERE id = ?", [id]);
  }
  static findByIdWithinAdmin(id, idAdmin) {
    return db.execute(
      "SELECT * FROM teachers WHERE id = ? AND adminCreator = ? ",
      [id, idAdmin]
    );
  }
  static updateUserVerified(isVerified, id) {
    return db.execute(
      `UPDATE teachers 
              SET isVerified = ?
              WHERE id = ?`,
      [isVerified, id]
    );
  }
  static updatePassword(password, id) {
    return db.execute(
      `UPDATE teachers 
              SET password = ?
              WHERE id = ?`,
      [password, id]
    );
  }
  static findByNameOrEmail(name, email, adminCreator) {
    // Adjust input parameters to handle partial values
    name = name ? `${name}` : null;
    email = email ? `${email}` : null;

    return db.execute(
      "SELECT * FROM teachers WHERE (fullName LIKE ? OR ? IS NULL) AND (email LIKE ? OR ? IS NULL) AND adminCreator = ?",
      [name, name, email, email, adminCreator]
    );
  }
  static removeById(id) {
    return db.execute("DELETE FROM teachers WHERE id = ?", [id]);
  }
  static async getTeacherWithModules(id) {
    try {
      const [rows] = await db.execute(
        `
        SELECT t.fullName AS teacher_name, m.id AS module_id, m.name AS module_name, m.semester AS module_semester,
        CASE WHEN m.idEditor = ? THEN true ELSE false END AS is_editor
        FROM teachers t
        JOIN module_teacher_association mta ON t.id = mta.idTeacher
        JOIN modules m ON mta.idModule = m.id
        WHERE t.id = ?`,
        [id, id]
      );

      // Process the rows and format the data
      const modules = rows.map((row) => ({
        teacher_name: row.teacher_name,
        module_id: row.module_id,
        module_name: row.module_name,
        module_semester: row.module_semester,
        is_editor: row.is_editor === 1 ? true : false,
      }));

      return modules;
    } catch (error) {
      console.error("Error fetching teacher with modules:", error);
      throw error;
    }
  }
  static getEditors() {
    return db.execute(`SELECT modules.id AS moduleId, 
    teachers.id AS id, 
    teachers.fullName AS fullName
        FROM modules
        INNER JOIN teachers ON modules.idEditor = teachers.id;
    `);
  }
}

module.exports = Teacher;
