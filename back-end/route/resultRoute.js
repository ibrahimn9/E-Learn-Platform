const express = require("express");
const router = express.Router({ mergeParams: true });

const {
  submitResult,
  getUserResults,
  getPassedStudents,
} = require("../controllers/resultController");

const authServices = require("../controllers/authController");
const { setQuizIdToBody } = require("../controllers/questionController");
// This route is Authorized For Teacher

router
  .route("/")
  .post(
    authServices.protect,
    authServices.allowedTo("student"),
    setQuizIdToBody,
    submitResult
  )
  .get(
    authServices.protect,
    authServices.allowedTo("teacher"),
    setQuizIdToBody,
    getUserResults
  );
router.route("/:resultId").get().put().delete();

router.get(
  "/module/:moduleId",
  authServices.protect,
  authServices.allowedTo("student"),
  getUserResults
);

router.get("/quiz/:quizId/students", getPassedStudents);

module.exports = router;
