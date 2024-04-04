const db = require("../config/database");
class Class {
  // constructor
  constructor(name, speciality) {
    this.name = name;
    this.speciality = speciality;
  }
  save() {
    return db.execute("INSERT INTO classes (name,speciality) VALUES (?,?)" , [
      this.name,
      this.speciality,
    ]);
  }
  static fetchById(id) {
    return db.execute("SELECT * FROM classes WHERE id = ?", [id]);
  }
  static findByName(name, speciality) {
    // Check if groupeNumber is null or undefined, and set it to NULL if it is
    speciality = speciality || null;
    name = name || null;
    return db.execute(
      "SELECT * FROM classes WHERE (name = ? OR ? IS NULL )  AND (speciality = ? OR ? IS NULL )",
      [name, name, speciality, speciality]
    );
  }
  static updateSpecialty(speciality, id) {
    return db.execute("UPDATE classes SET speciality = ? WHERE id = ?", [
      speciality,
      id,
    ]);
  }
  static deleteById(id) {
    return db.execute("DELETE FROM  classes WHERE id = ?", [id]);
  }
}

module.exports = Class;
