const express = require("express");
const router = express.Router();

const {
	createQuiz,
	deleteQuiz,
	editQuiz,
	getQuizById,
	fetchQuizByModule,
	searchQuiz,
	fetchQuizByTeacher,
	getStudentQuiz,
} = require("../controllers/quizController");
const resultRoute = require("./resultRoute");
const authServices = require("../controllers/authController");
const questionRoute = require("./questionRoute");
// This route is Authorized For Teacher
router.use("/:quizId/result", resultRoute);
router.use(
	"/:quizId/questions",
	authServices.protect,
	authServices.allowedTo("student", "teacher"),
	questionRoute
);
router
	.route("/")
	.post(authServices.protect, createQuiz)
	.get(searchQuiz);
router.get("/student", getStudentQuiz);
router
	.route("/:quizId")
	.get(getQuizById)
	.put(authServices.protect, editQuiz)
	.delete(authServices.protect, authServices.allowedTo("teacher"), deleteQuiz);
router.get(
	"/module/:moduleId",
	authServices.protect,
	fetchQuizByModule
);
router.get(
	"/teacher/:teacherId",
	authServices.protect,
	authServices.allowedTo("teacher"),
	fetchQuizByTeacher
);
module.exports = router;
