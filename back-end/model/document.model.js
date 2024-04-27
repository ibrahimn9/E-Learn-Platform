const db = require("../config/database");

class Document {
    constructor(title, description, type, file, idChapter) {
        this.title = title;
        this.description = description;
        this.type = type;
        this.file = file;
        this.idChapter = idChapter;
    }

    save() {
        return db.execute(
            `INSERT INTO documents (title, description, type, file, idChapter) VALUES (?, ?, ?, ?, ?)`,
            [this.title, this.description, this.type, this.file, this.idChapter]
        );
    }
    static getAllDocumentsForChapter(idChapter){
        return db.execute('SELECT * FROM documents WHERE idChapter = ?', [idChapter])
    }
}

module.exports = Document;
