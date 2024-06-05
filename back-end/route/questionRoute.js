const express = require("express");

// merge Params : allow us to access parameters on other route
const router = express.Router({ mergeParams: true });
const {
	addSingleQuestion,
	setQuizIdToBody,
	addMultipleQuestion,
	getQuestionsQuiz,
	updateQuestion,
	deleteQuestion,
	getQuestionsQuizStudent
} = require("../controllers/questionController");

const authServices = require("../controllers/authController");
// This route is Authorized For Teacher

router
	.route("/")
	.post(
		authServices.protect,
		authServices.allowedTo("teacher"),
		setQuizIdToBody,
		addSingleQuestion
	)
	.get(setQuizIdToBody, getQuestionsQuiz);
router.post(
	"/multiple",
	authServices.protect,
	authServices.allowedTo("teacher"),
	setQuizIdToBody,
	addMultipleQuestion
);
router
	.route("/:questionId")
	.get()
	.put(authServices.protect, authServices.allowedTo("teacher"), updateQuestion)
	.delete(
		authServices.protect,
		authServices.allowedTo("teacher"),
		deleteQuestion
	);
router
    .route("/:idQuiz/student")
	.get(getQuestionsQuizStudent)

module.exports = router;
