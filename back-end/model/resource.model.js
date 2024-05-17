const db = require("../config/database");
class Resource {
  // constructor
  constructor(description, type, link, idModule ) {
    this.description = description;
    this.type = type;
    this.link = link;
    this.idModule = idModule;
  }
  save() {
    return db.execute(
      `INSERT INTO resources (description,type,link,  idModule) VALUES (?,?,?,?) `,
      [this.description, this.type, this.link, this.idModule]
    );
  }
  static fetchAll(description, type) {
    description = description ? `%${description}%` : null;
    type = type || null;
    return db.execute(
      "SELECT ressources.id , ressources.description,ressources.type ,ressources.file, modules.name , modules.semester , teachers.fullName FROM ressources LEFT JOIN modules ON modules.id = ressources.idModule LEFT JOIN teachers ON teachers.id = modules.idEditor WHERE  (ressources.type  LIKE ? OR ? IS NULL) AND (ressources.description LIKE ? OR ? IS NULL) ",
      [type, type, description, description]
    );
  }
  static findById(id) {
    return db.execute(
      "SELECT ressources.id , ressources.type,ressources.description ,ressources.file, modules.name , modules.semester , teachers.fullName FROM ressources LEFT JOIN modules ON modules.id = ressources.idModule LEFT JOIN teachers ON teachers.id = modules.idEditor  WHERE ressources.id = ?",
      [id]
    );
  }
  static updateResource(description, link, id) {
    description = description || null;
    link = link || null;
    return db.execute(
      "UPDATE ressources SET description = IFNULL(?, description),  file = IFNULL(?, file) WHERE id = ?",
      [description, link, id]
    );
  }
  static deleteById(id) {
    return db.execute("DELETE FROM  ressources WHERE id = ?", [id]);
  }
  static findByModuleId(id) {
    return db.execute(
      "SELECT resources.id , resources.type ,resources.description, resources.link  FROM resources LEFT JOIN modules ON modules.id = resources.idModule LEFT JOIN teachers ON teachers.id = modules.idEditor  WHERE resources.idModule = ?",
      [id]
    );
  }
}

module.exports = Resource;
