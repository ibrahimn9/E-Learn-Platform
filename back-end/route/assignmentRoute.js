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
    getStudentAssignments
} = require("../controllers/assignmentController");
const submissionRoute = require("./submissionRoute");
const evaluationRoute = require("./evaluationRoute");
const authServices = require("../controllers/authController");
router.use(
    "/:assignmentId/submission",
    authServices.protect,
    submissionRoute
);
router.use("/:assignmentId/evaluation",authServices.protect, evaluationRoute);
router.get("/file/:fileId",authServices.protect, getAssignmentFile);
// This route is Authorized For Admin


router
    .route("/")
    .post(upload.single("file"), createAssignment)
    .get(getAssignments);
router
    .route("/:assignmentId")
    .get(getAssignment)
    .delete(deleteAssignment)
    .put(updateAssignment);
router
    .route("/module/:moduleId")
    .get(getStudentAssignments)
module.exports = router;
