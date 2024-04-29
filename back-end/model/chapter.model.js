const db = require("../config/database");

class Chapter{
    constructor(title,description,idModule){
        this.title = title;
        this.description =description;
        this.idModule = idModule;
    }
    save() {
		return db.execute(
			`INSERT INTO chapters (title,description,idModule) VALUES (?,?,?) `,
			[this.title, this.description,this.idModule]
		);
	}
    static getAllByModuleId(idModule) {
        return db.execute(
            `SELECT * FROM chapters WHERE idModule = ?`,
            [idModule]
        );
    }
    static deleteById(idChapter){
        return db.execute(
            `DELETE FROM chapters where id=?`,[idChapter]
        )
    }
}

module.exports = Chapter;