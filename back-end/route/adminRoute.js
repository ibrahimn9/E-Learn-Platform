const express = require("express");
const {uploadStudents, uploadTeachers} =require('../controllers/adminController');
const {upload} =require('../middlewares/multer');
const verifyAuth = require('../middlewares/isAuth');
const {uploadValidator} = require('../utils/validator/fileValidator');
const router = express.Router();
// /api/v1/admin/upload-Students
router.post('/upload-Students',verifyAuth,upload.single('file'),uploadValidator,uploadStudents);
// /api/v1/admin/upload-Teachers
router.post('/upload-Teachers',verifyAuth,upload.single('file'),uploadValidator,uploadTeachers);

module.exports = router;