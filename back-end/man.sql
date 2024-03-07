CREATE TABLE cohortes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nbrGroup INT,
    totalMember INT,
    idAdmin INT,
    FOREIGN KEY (idAdmin) REFERENCES admins(id)
);


CREATE TABLE students (
    id INT PRIMARY KEY AUTO_INCREMENT,
    fullName VARCHAR(50) NOT NULL,
    email VARCHAR(50) NOT NULL,
    password VARCHAR(255) NOT NULL,
    isVerified BOOLEAN DEFAULT NULL,
    idCohorte INT,
    FOREIGN KEY (idCohorte) REFERENCES cohortes(id),
    idAdmin INT,
    FOREIGN KEY (idAdmin) REFERENCES admins(id)
);




-- Inserting random data into the admins table
INSERT INTO admins (fullName, email, password)
VALUES 
    ('Admin Six', 'lokmanezeddoun@gmail.com', 'admin123')

INSERT INTO teachers (fullName, email, password, role, idAdmin)
VALUES 
    ('Teacher Six', 'zeddoun.lokmane@gmail.com', 'teacher123', 'Editor', 6);

INSERT INTO students (fullName, email, password, idCohorte, idAdmin)
VALUES 
    ('Lokmane Zeddoun', 'l.zeddoun@esi-sba.dz', 'password123', 5, 6)