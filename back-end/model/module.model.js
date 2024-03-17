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
      [
        this.name,
        this.semester,
        this.description,
        this.idEditor,
      ]
    );
  }
  static fetchAll(name, profEditor, semester) {
    return db.execute(
      "SELECT * FROM modules WHERE (name = ? OR ? IS NULL) AND(idEditor = ? OR ? IS NULL)  AND (semester = ? OR ? IS NULL)",
      [name, profEditor, semester]
    );
  }
  static findById(id) {
    return db.execute("SELECT * FROM modules WHERE id = ? ", [id]);
  }
  static deleteById(id) {
    return db.execute("DELETE FROM modules WHERE id = ?", [id]);
  }
  static updateEditor(idEditor, id) {
    return db.execute(
      `UPDATE modules
SET idEditor = ?
WHERE id = ?`,
      [idEditor, id]
    );
  }
}

module.exports = Module;
