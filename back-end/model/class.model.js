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
  static findByName(name, speciality) {
    // Check if groupeNumber is null or undefined, and set it to NULL if it is
    speciality = speciality || null;
    name = name || null;
    return db.execute("SELECT * FROM classes where (name=? or ? IS NULL) and (speciality=? OR ? IS NULL)  ", [
      name,
      name,
      speciality,
      speciality
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
