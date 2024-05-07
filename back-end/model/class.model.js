const db = require("../config/database");
class Class {
  // constructor
  constructor(name, specialty) {
    this.name = name;
    this.specialty = specialty;
  }
  save() {
    return db.execute(`INSERT INTO classes (name,specialty) VALUES (?,?) `, [
      this.name,
      this.specialty,
    ]);
  }
  static findById(id) {
    return db.execute("SELECT * FROM classes WHERE id = ?", [id]);
  }
  static fetchById(id) {
    return db.execute("SELECT * FROM classes WHERE id = ?", [id]);
  }
  static findByName(name, specialty) {
    // Check if groupeNumber is null or undefined, and set it to NULL if it is
    specialty = specialty || null;
    name = name || null;
    return db.execute("SELECT * FROM classes", [
      name,
      specialty,
    ]);
  }
  static updateSpecialty(specialty, id) {
    return db.execute("UPDATE classes SET specialty = ? WHERE id = ?", [
      specialty,
      id,
    ]);
  }
  static deleteById(id) {
    return db.execute("DELETE FROM  classes WHERE id = ?", [id]);
  }
}

module.exports = Class;
