const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/ApiError.js");
const Quiz = require("../model/quiz.model.js");
const Question = require("../model/question.model.js");
const Option = require("../model/option.model.js");
const setQuizIdToBody = (req, res, next) => {
	// Nested Route
	if (!req.body.quiz) req.body.quiz = req.params.quizId;
	next();
};
const addSingleQuestion = asyncHandler(async (req, res, next) => {
	const { questionText, note, options, quiz } = req.body;
	// 1-check if the quizId Is valid
	const [[data]] = await Quiz.findById(quiz);
	if (!data) {
		return next(new ApiError(`There is no Quiz For this Id `, 404));
	}
	let result;
	// 2- Save the question To db
	try {
		const question = new Question(quiz, questionText, note);
		[result] = await question.save();
		// 2-save the options
		await Promise.all(
			options.map(async (item) => {
				try {
					const option = new Option(result.insertId, item.isCorrect, item.text);
					await option.save();
				} catch (err) {
					// Handle the error
					throw new Error(err.message);
				}
			})
		);
	} catch (err) {
		return next(new ApiError(err.message, 400));
	}
	res.status(200).json({ msg: "Question Added" });
});

const addMultipleQuestion = asyncHandler(async (req, res, next) => {
	const { questions, options, quiz } = req.body;
	const [[data]] = await Quiz.findById(quiz);
	if (!data) {
		return next(new ApiError(`There is no Quiz For this Id `, 404));
	}
	let result;
	// 2- Save the question To db In the Same time  with the options
	try {
		await Promise.all(
			questions.map(async (data, index) => {
				const question = new Question(quiz, data.text, data.note);
				[result] = await question.save();
				try {
					options[index].map(async (item) => {
						try {
							let option;

							option = new Option(result.insertId, item.isCorrect, item.text);
							await option.save();
						} catch (err) {
							// Handle the error
							throw new Error(err.message);
						}
					});
				} catch (err) {
					throw new Error(err.message);
				}
			})
		);
	} catch (err) {
		return next(new ApiError(err.message, 400));
	}
	res.status(200).json({ msg: "Questions Added" });
});
const updateQuestion = asyncHandler(async (req, res, next) => {
	const { note, questionText, options } = req.body || null;
	if (options) {
		try {
			// delete all the options under a single question
			await Option.deleteByQuestionId(req.params.questionId);
			// update the options
			await Promise.all(
				options.map(async (item) => {
					try {
						const option = new Option(
							req.params.questionId,
							item.isCorrect,
							item.text
						);
						await option.save();
					} catch (err) {
						// Handle the error
						throw new Error(err.message);
					}
				})
			);
		} catch (err) {
			return next(new ApiError(err.message, 400));
		}
	}
	const [[result]] = await Question.findById(req.params.questionId);
	if (!result) {
		return next(new ApiError(`There is no Question for this `, 404));
	}
	try {
		await Question.updateQuestion(req.params.questionId, note, questionText);
	} catch (err) {
		return next(new ApiError(err.message, 400));
	}
	res.status(200).json({ msg: "updated Successfully" });
});
const deleteQuestion = asyncHandler(async (req, res, next) => {
	const [[document]] = await Question.findById(req.params.questionId);
	if (!document) {
		return next(
			new ApiError(`No Question for this id ${req.params.questionId}`, 404)
		);
	}
	try {
		await Option.deleteByQuestionId(req.params.questionId);
		await Question.deleteById(req.params.questionId);
	} catch (err) {
		return next(new ApiError(err.message, 400));
	}
	res.status(204).send();
});
const getQuestionsQuiz = asyncHandler(async (req, res, next) => {
	const { quiz } = req.body;
	let total = 0;
	const [result] = await Question.findQuestionsByQuiz(quiz);
	await Promise.all(
		result.map(async (item, index) => {
			total += item.note;
			const [options] = await Question.findOptions(item.id);
			result[index].options = options.map((value) => value.optionText);
			result[index].optionsIds = options.map((value) => value.id);
		})
	);
	req.session.startQuiz = new Date();
	res.status(200).json({ questions: result, scoreTotal: total });
});

module.exports = {
	addSingleQuestion,
	setQuizIdToBody,
	addMultipleQuestion,
	updateQuestion,
	deleteQuestion,
	getQuestionsQuiz,
};
