const express = require("express");
const router = express.Router();
const {
  getModulesByCohorteId,
  getModulesByStudentId,
} = require("../controllers/studentController");

const authServices = require("../controllers/authController");
//router.use(authServices.protect, authServices.allowedTo("student"));
// /api/v1/student/:cohortId
router.get("/:cohortId", getModulesByCohorteId);

// /api/v1/student/modules/:studentId
router.get("/modules/:studentId", getModulesByStudentId);

module.exports = router;
