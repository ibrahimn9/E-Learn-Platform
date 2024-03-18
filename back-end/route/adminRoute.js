const express = require("express");
const {uploadStudents, uploadTeachers,removeStudentById,removeStudentsByClassId,removeTeacherById} =require('../controllers/adminController');
const {upload} =require('../middlewares/multer');
const {uploadValidator} = require('../utils/validator/fileValidator');
const router = express.Router();

const authServices = require("../controllers/authController");
// This route is Authorized For Admin
router.use(authServices.protect, authServices.allowedTo("admin"));
// /api/v1/admin/insert-new-students
router.post('/insert-new-students',upload.single('file'),uploadValidator,uploadStudents);
// /api/v1/admin/insert-new-teachers
router.post('/insert-new-teachers',upload.single('file'),uploadValidator,uploadTeachers);
// /api/v1/admin/delete-student/:id
router.delete('/delete-student/:id',removeStudentById);
// /api/v1/admin/delete-teacher/:id
router.delete('/delete-teacher/:id',removeTeacherById);
// /api/v1/admin/delete-students/:id
router.delete('/delete-students/:id',removeStudentsByClassId);

module.exports = router;