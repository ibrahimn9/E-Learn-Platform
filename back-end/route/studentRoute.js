const express = require("express");
const router = express.Router();
const {getModulesByCohorteId}= require('../controllers/studentController');


const authServices = require("../controllers/authController");
router.use(authServices.protect, authServices.allowedTo("student"));
// /api/v1/student/:cohortId
router.get('/:cohortId',getModulesByCohorteId);

module.exports = router