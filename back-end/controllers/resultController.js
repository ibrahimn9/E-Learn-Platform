const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/ApiError.js");
const Quiz = require("../model/quiz.model.js");
const Question = require("../model/question.model.js");
const Option = require("../model/option.model.js");
const Result = require("../model/result.model.js");
const studentQuizzes = require("../model/quiz_student-association.model.js");
const submitResult = asyncHandler(async (req, res, next) => {
	// check if the quiz isn't over time
	const [[quiz]] = await Quiz.findById(req.body.quiz);
	if (quiz.timeEnd < new Date()) {
		return next(new ApiError("The Quiz Is Over", 400));
	}
	// check if the submit
	const { responses } = req.body;
	let userScore = 0;
	if (req.session.startQuiz) {
		// 1-calculate the elapsedTime
		const quizStartTime = new Date(req.session.startQuiz);
		req.session.startQuiz = null;
		const currentTime = Date.now();
		const elapsedTime = currentTime - quizStartTime.getTime();
		if (elapsedTime > quiz.duration * 1000) {
			return next(new ApiError("Quiz Duration exceeded", 400));
		} else {
			// change the quizTaken Attribute To True
			await studentQuizzes.setQuiz(req.body.quiz, req.user.id);
			// -- Calculate The Score
			// get the questions Ids Quiz
			const [questions] = await Question.getQuestionsIdsAndNote(req.body.quiz);
			if (questions.length) {
				for (const question of questions) {
					// get the user responses for this question
					const response = findUserAnswerForQuestion(responses, question.id);
					if (response) {
						// get the right options and compare it with the student options
						const [rightAnswers] = await Option.getRightOptionsOfQuestion(
							question.id
						);
						const ids = rightAnswers.map((value) => value.id);
						if (arraysAreEqual(ids, response.userOptions)) {
							userScore += question.note;
						}
					}
				}
			} else {
				return next(
					new ApiError(`There is no Questions To Submit it's response `, 400)
				);
			}
		}
	} else {
		return next(new ApiError("Get The Quiz Questions Before You Submit", 400));
	}
	// save the user Score And the
	const userResult = new Result(req.body.quiz, req.user.id, userScore);
	try {
		await userResult.save();
	} catch (err) {
		if (err.code === "ER_DUP_ENTRY") {
			throw new Error(`You Submit the Answer of This Quiz Before`);
		}
	}
	// get the score Total of Quiz
	const [[result]] = await Quiz.getScoreTotal(req.body.quiz);
	res.status(200).json({
		msg: `You got ${userScore}  Of ${result.score_total}`,
		userScore,
		Total: result.score_total,
	});
});

const findUserAnswerForQuestion = (responses, id) => {
	for (const res of responses) {
		if (res.questionId === id) {
			return res;
		}
	}
};
function arraysAreEqual(arr1, arr2) {
	// Check if lengths are different
	if (arr1.length !== arr2.length) return false;

	// Compare each element
	for (let i = 0; i < arr1.length; i++) {
		if (arr1[i] !== arr2[i]) return false;
	}

	// All elements are the same
	return true;
}
const getUserResults = asyncHandler(async (req, res, next) => {
	// get the quizId
	const [results] = await Quiz.getUsersResults(req.body.quiz);
	const [[score_total]] = await Quiz.getScoreTotal(req.body.quiz);
	results.push(score_total);
	res.status(200).json(results);
});
module.exports = { submitResult, getUserResults };
