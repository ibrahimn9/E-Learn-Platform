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
} = require("../controllers/assignmentController");
const submissionRoute = require("./submissionRoute");
const evaluationRoute = require("./evaluationRoute");
const authServices = require("../controllers/authController");
router.use(
    "/:assignmentId/submission",
    authServices.protect,
    authServices.allowedTo("student"),
    submissionRoute
);
router.use("/:assignmentId/evaluation", evaluationRoute);
router.get("/file/:fileId", getAssignmentFile);
// This route is Authorized For Admin
router.use(authServices.protect, authServices.allowedTo("teacher"));

router
    .route("/")
    .post(upload.single("file"), createAssignment)
    .get(getAssignments);
router
    .route("/:assignmentId")
    .get(getAssignment)
    .delete(deleteAssignment)
    .put(updateAssignment);
module.exports = router;
