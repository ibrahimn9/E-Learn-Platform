const express = require("express");
const router = express.Router();
const {getModulesOfTeacher}= require('../controllers/teacherController');

const authServices = require("../controllers/authController");
router.use(authServices.protect, authServices.allowedTo("teacher"));
// /api/v1/teacher/:teacherId
router.get('/:teacherId',getModulesOfTeacher);

module.exports = router;