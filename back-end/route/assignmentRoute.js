const express = require("express");
const router = express.Router();
const { upload } = require("../middlewares/multer");
const {
  createAssignment,
  getAssignment,
  getAssignmentFile,
  deleteAssignment,
  updateAssignment,
  getAssignments,
  getStudentAssignments,
} = require("../controllers/assignmentController");
const submissionRoute = require("./submissionRoute");
const evaluationRoute = require("./evaluationRoute");
const authServices = require("../controllers/authController");
router.use("/:assignmentId/submission", authServices.protect, submissionRoute);
router.use("/:assignmentId/evaluation", authServices.protect, evaluationRoute);
router.get("/file/:fileId", authServices.protect, getAssignmentFile);
// This route is Authorized For Admin

router
  .route("/")
  .post(upload.single("file"), authServices.protect, createAssignment)
  .get(authServices.protect, getAssignments);
router
  .route("/:assignmentId")
  .get(authServices.protect, getAssignment)
  .delete(authServices.protect, deleteAssignment)
  .put(authServices.protect, updateAssignment);
router
  .route("/module/:moduleId")
  .get(authServices.protect, getStudentAssignments);
module.exports = router;
