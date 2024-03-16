const db = require("../config/database");

class Module {
    constructor(name, semester, description, speciality, idEditor, idClass) {
        this.name = name;
        this.semester = semester;
        this.description = description;
        this.speciality = speciality;
        this.idEditor = idEditor;
        this.idClass = idClass;
    }

    save() {
        return db.execute(
            `INSERT INTO modules (name, semester, description, speciality, idEditor, idClass) VALUES (?, ?, ?, ?, ?, ?)`,
            [this.name, this.semester, this.description, this.speciality, this.idEditor, this.idClass]
        );
    }

    static fetchAll() {
        return db.execute("SELECT * FROM modules");
    }
}

module.exports = Module;

