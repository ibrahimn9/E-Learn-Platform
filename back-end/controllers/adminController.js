const csv = require("csv-parser");
const fs = require("fs");
const Student = require('../model/student.model');
const Teacher = require('../model/teacher.model');
const Cohorte = require('../model/cohort.model');
const ApiError = require("../utils/ApiError.js");
const asyncHandler = require("express-async-handler");

/**-----------------------------------------------
 * @desc    insert new students
 * @route   /api/v1/admin/insert-new-students
 * @method  POST
 * @access  Admin
------------------------------------------------*/
const uploadStudents = asyncHandler(async (req,res,next) =>{
    try {
        if (!req.file) {
          return next(new ApiError("No file uploaded",400));
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
                  req.user.id,
                  rows[0].id
                );
                // Save the student to the database
                await student.save();
              } catch (error) {
                return next(new ApiError("Error saving student:",error));
                // Handle error appropriately (skip or stop processing)
              }
            }
    
            // Delete the uploaded file after processing
            fs.unlinkSync(req.file.path);
            res.status(200).json({ message: "Students inserted successfully" });
          });
      } catch (error) {
        console.error("Error uploading file:", error);
        return next(new ApiError('Internal server error',500));
      }
})


/**-----------------------------------------------
 * @desc    insert new teachers
 * @route   /api/v1/admin/insert-new-teachers
 * @method  POST
 * @access  Admin
------------------------------------------------*/
const uploadTeachers = asyncHandler(async (req,res,next) =>{
  try {
    if (!req.file) {
      return next(new ApiError("No file uploaded",400));
    }
    const teachers = [];
    fs.createReadStream(req.file.path)
      .pipe(csv())
      .on("data", async (row) => {
        const { fullName, email, password} = row;
        // Assuming adminCreator is provided in the CSV file
        const teacher = new Teacher(fullName, email, password,req.user.id);
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
    return next( "Internal Server Error",500)
  }
})

/**-----------------------------------------------
 * @desc    delete student by id
 * @route   /api/v1/admin/delete-student/:id
 * @method  DELETE
 * @access  Admin
------------------------------------------------*/
const removeStudentById = asyncHandler(async (req, res,next) => {
  const studentId = req.params.id; // Assuming the ID is passed in the request parameters

  try {
      // Call the static method to remove the student
      const [result] = await Student.removeById(studentId);

      // Check if any rows were affected by the deletion
      if (result.affectedRows > 0) {
          // Student successfully removed
          return res.status(200).json({ message: 'Student removed successfully' });
      } else {
          // No student found with the given ID
          return next(new ApiError('Student not found',404));
      }
  } catch (error) {
      // Handle any errors that occur during the deletion process
      console.error('Error removing student:', error);
      return next(new ApiError('An internal server error occurred',500))
  }
});

/**-----------------------------------------------
 * @desc    delete teacher by id
 * @route   /api/v1/admin/delete-teacher/:id
 * @method  DELETE
 * @access  Admin
------------------------------------------------*/
const removeTeacherById = asyncHandler(async (req, res,next) => {
  const teacherId = req.params.id; // Assuming the ID is passed in the request parameters

  try {
      // Call the static method to remove the student
      const [result] = await Teacher.removeById(teacherId);

      // Check if any rows were affected by the deletion
      if (result.affectedRows > 0) {
          // Student successfully removed
          return res.status(200).json({ message: 'Student removed successfully' });
      } else {
          // No student found with the given ID
          return next(new ApiError('Student not found',404));
      }
  } catch (error) {
      // Handle any errors that occur during the deletion process
      console.error('Error removing student:', error);
      return next(new ApiError('An internal server error occurred',500))
  }
});

/**-----------------------------------------------
 * @desc    delete students by classId
 * @route   /api/v1/admin/delete-students/:id
 * @method  DELETE
 * @access  Admin
------------------------------------------------*/
const removeStudentsByClassId = asyncHandler(async (req, res, next) => {
  const classId = req.params.id; // Assuming the class ID is passed in the request parameters

  try {
      // Call the static method to remove students by classId
      const [result] = await Student.removeByClassId(classId);

      // Check if any rows were affected by the deletion
      if (result.affectedRows > 0) {
          // Students successfully removed
          return res.status(200).json({ message: 'Students removed successfully' });
      } else {
          // No students found for the given class ID
          return next(new ApiError('No students found for the given class ID', 404));
      }
  } catch (error) {
      // Handle any errors that occur during the deletion process
      console.error('Error removing students by class ID:', error);
      return next(new ApiError('An internal server error occurred', 500));
  }
});


module.exports ={
    uploadStudents,
    uploadTeachers,
    removeStudentById,
    removeTeacherById,
    removeStudentsByClassId
}