const csv = require("csv-parser");
const fs = require("fs");
const Student = require('../model/student.model');
const Teacher = require('../model/teacher.model');
const Cohorte = require('../model/cohort.model');
const asyncHandler = require("express-async-handler");

const uploadStudents = asyncHandler(async (req,res,next) =>{
    try {
        if (!req.file) {
          return res.status(400).json({ error: "No file uploaded" });
        }
    
        const results = [];
    
        // Read the uploaded CSV file
        fs.createReadStream(req.file.path)
          .pipe(csv())
          .on("data", (data) => results.push(data))
          .on("end", async () => {
            // Iterate over each row in the CSV file
            for (const studentData of results) {
                const [rows, fields] = await Cohorte.getCohortIdByClassAndGroupNumber(studentData.idClass,studentData.groupeNumber)
              try {
                // Create a new Student object using data from CSV
                const student = new Student(
                  studentData.fullName,
                  studentData.email,
                  studentData.password,
                  req.user.userId,
                  rows[0].id
                );
                // Save the student to the database
                await student.save();
              } catch (error) {
                console.error("Error saving student:", error);
                // Handle error appropriately (skip or stop processing)
              }
            }
    
            // Delete the uploaded file after processing
            fs.unlinkSync(req.file.path);
    
            res.status(200).json({ message: "Students inserted successfully" });
          });
      } catch (error) {
        console.error("Error uploading file:", error);
        res.status(500).json({ error: "Internal server error" });
      }
})

const uploadTeachers = asyncHandler(async (req,res,next) =>{
  try {
    const teachers = [];
    fs.createReadStream(req.file.path)
      .pipe(csv())
      .on("data", async (row) => {
        const { fullName, email, password} = row;
        // Assuming adminCreator is provided in the CSV file
        const teacher = new Teacher(fullName, email, password,req.user.userId);
        teachers.push(teacher);
      })
      .on("end", async () => {
        for (const teacher of teachers) {
          await teacher.save();
        }
        res.status(201).json({ message: "Teachers inserted successfully" });
      });
  } catch (err) {
    console.error("Error inserting teachers:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
})

module.exports ={
    uploadStudents,
    uploadTeachers
}