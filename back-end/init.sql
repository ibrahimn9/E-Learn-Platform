--Table Of Admin
create table admins (id int primary key auto_increment , fullName varchar(50) not null, email varchar(50) not null,password VARBINARY(255) default null , isVerified boolean default null
  )
-- Table Of Class
create table classes (id int primary key auto_increment , name varchar(255) not null)
-- Table Of Group
create table groups(id int primary key auto_increment , nbr_group int , total_member int,foreign key (idClass) references classes(id),foreign key (idAdmin) references admins(id))

-- Table Of Student
create table students (id int primary key auto_increment , fullName varchar(50) not null, email varchar(50) not null,password VARBINARY(255) default null , isVerified boolean default null,idGroup int , foreign key(idGroup) references groups(id) , idAdmin int ,foreign key (idAdmin) references admins(id) 
  )

-- Table Of Teacher
create table teachers (id int primary key auto_increment , fullName varchar(50) not null, email varchar(50) not null,password VARBINARY(255) default null ,role enum('Editor','Non-Editor') default null , isVerified boolean default null , idAdmin int ,foreign key (idAdmin) references admins(id)
  )
-- Table Of Module 
create table modules (id int primary key auto_increment , name varchar(255) not null, semester enum('semester01','semester02') not null , description  varchar(255) not null , foreign key (idClass) references classes(id) )

--Table Of Chapter
create table chapters (id int primary key auto_increment , name varchar(255) not null , foreign key(idModule) references modules(id))

--Table Of Course
create table courses (id int primary key auto_increment,name varchar(255) not null , description varchar(255) not null , content varchar(255) , foreign key (idChapter) references chapters(id))
--Table Of Moocs
create table moocs (id int primary key auto_increment,name varchar(255) not null , description varchar(255) not null , content varchar(255) , foreign key (idChapter) references chapters(id))
--Table Of Test
create table tests (id int primary key auto_increment,delay varchar(255),name varchar(255) not null , description varchar(255) not null , content varchar(255) , foreign key (idChapter) references chapters(id))
--Table Answers_T
create table answers_t (id int primary key auto_increment , isCorrect boolean,note int,foreign key (idTest) references tests(id))
--Table Of Quiz
create table quizes (id int primary key auto_increment,delay varchar(255),name varchar(255) not null , description varchar(255) not null , content varchar(255) , foreign key (idChapter) references chapters(id),foreign key (idStudent) references students(id))

--Table Of Question 
create table questiones (id int primary key auto_increment,text varchar(255) not null, foreign key (idQuiz) references quizes(id))
--Table Answers_Q
create table answers_q (id int primary key auto_increment , isCorrect boolean,note int,foreign key (idQuestion) references questions(id),foreign key (idQuiz) references quizes(id),foreign key (idStudent) references students(id))

-- Table Of Conversation
create table conversations (id int primary key auto_increment , name varchar(255) not null , foreign key (idTeacher) references teachers(id))

-- Table Of Message
create table messages (id int primary key auto_increment , text varchar(255) ,  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,foreign key (idConversation) references conversations(id))

-- Table Of History
create table history (id int primary key auto_increment , event_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,foreign key (idStudent) references students(id))
-- Table Of Notification
create table notifications (id int primary key auto_increment ,text varchar(255))

--Association Between Teacher And Group table
create table responsible (idGroup int,idTeacher int,foreign key (idGroup) references groups(id) , foreign key (idTeacher) references teachers(id) , primary key(idGroup,idTeacher))


-- Association Between Teacher And Module table
create table teaching (foreign key (idTeacher) references teachers(id) ,foreign key (idModule) references modules(id) , primary key(idTeacher,idModule))


--Association Between Student and Conversation table
create table accessTo (foreign key (idStudent) references students(id),foreign key (idConversation) references conversations(id) , primary key (idStudent,idConversation))
-- Assocation Between Message And Student table
create table reaction (foreign key (idStudent) references students(id),foreign key (idMessage) references messages(id),primary key(idStudent , idMessage),type varchar(255) default null)

-- Association Between Notification And Student table
create table notification_recipients (foreign key(idStudent) references students(id),foreign key(idNotification) references notifications(id) , primary key(idStudent,idNotifcaion))
-- Association Between Course And History table
create table belongs_to (foreign key (idHisotry) references history(id),foreign key(idCourse) references courses(id) , primary key (idHisotry , idCourse))

-- Association Between Test And Student 
create table users_test (foreign key(idStudent) references students(id) , foreign key (idTest) references tests(id) , primary key (idStudent , idTest))

-- Association Between Test And Student 
create table users_quiz (foreign key(idStudent) references students(id) , foreign key (idQuiz) references quizes(id) , primary key (idStudent , idQuiz))