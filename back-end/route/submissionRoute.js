const express = require("express");
const router = express.Router({ mergeParams: true });
const { upload } = require("../middlewares/multer");
const {
  submitAssignment,
  showUserSubmission,
  showAssignmentSubmission,
} = require("../controllers/submissionController");

const authServices = require("../controllers/authController");

// Routes for submitting assignments and viewing submissions
router.post(
  "/:assignmentId",
  authServices.protect,
  authServices.allowedTo("student"),
  upload.single("file"),
  submitAssignment
);

router.get(
  "/user",
  authServices.protect,
  authServices.allowedTo("student"),
  showUserSubmission
);

router.get(
  "/answers/:assignmentId",
  authServices.protect,
  authServices.allowedTo("teacher"),
  showAssignmentSubmission
);

module.exports = router;
