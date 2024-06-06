const express = require("express");
const router = express.Router({ mergeParams: true });

const {
    evaluateSubmission,
    getAssignmentEvaluation,
} = require("../controllers/evaluationController");

const authServices = require("../controllers/authController");
// This route is Authorized For Admin

router
    .route("/")
    .post(
        authServices.protect,
        authServices.allowedTo("teacher"),
        evaluateSubmission
    )
    .get(
        authServices.protect,
        authServices.allowedTo("teacher"),
        getAssignmentEvaluation
    );

router.route("/:evaluationId").get().delete().put();
module.exports = router;
