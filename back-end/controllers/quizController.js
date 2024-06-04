const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/ApiError.js");
const Quiz = require("../model/quiz.model.js");
const module_cohorte_association = require("../model/module_cohorte_association.model.js");
const quizStudentModel = require("../model/quiz_student-association.model.js");
const Module = require("../model/module.model.js");
const Teacher = require("../model/teacher.model.js");

const createQuiz = asyncHandler(async (req, res, next) => {
	const { quizName, moduleId } = req.body;
	const { duration, endTime } = req.body || null;
	// check if the endTime is valid
	const endDate = new Date(endTime);
	const currentTime = new Date();

	if (endDate.getTime() < currentTime.getTime() + duration * 60000) {
		return next(new ApiError(`Invalid End Time `, 400));
	}
	try {
		const quiz = new Quiz(quizName, req.user.id, moduleId, endTime, duration);
		const [done] = await quiz.save();
		const [result] = await module_cohorte_association.getStudentIds(moduleId);
		const ids = result.map((item) => item.id).filter((id) => id !== null);
		for (id of ids) {
			const quizItem = new quizStudentModel(id, done.insertId);
			await quizItem.save();
		}
	} catch (err) {
		// Handle  error
		return next(new ApiError(`There is Error Occurred ${err.message}`, 400));
	}

	res.status(201).json({ message: "Quiz Added" });
});

const editQuiz = asyncHandler(async (req, res, next) => {
	const { duration, timeEnd } = req.body || null;
	if (timeEnd) {
		const endDate = new Date(timeEnd);
		if (endDate.getTime() < new Date().getTime() + duration) {
			return next(new ApiError(`Invalid End Time `, 400));
		}
	}
	let result;
	try {
		[result] = await Quiz.updateQuiz(
			req.params.quizId,
			req.body.quizName,
			duration,
			timeEnd
		);
	} catch (err) {
		return next(new ApiError(err.message, 400));
	}
	return res.status(200).json({ msg: "Updated Successfully" });
});
const deleteQuiz = asyncHandler(async (req, res, next) => {
	const [[document]] = await Quiz.findById(req.params.quizId);
	if (!document) {
		return next(new ApiError(`No Quiz for this id ${req.params.quizId}`, 404));
	}
	await Quiz.deleteById(req.params.quizId);
	res.status(204).send();
});
const getQuizById = asyncHandler(async (req, res, next) => {
	const [[document]] = await Quiz.findById(req.params.quizId);
	if (!document) {
		return next(new ApiError(`There is no Quiz For this Id`, 404));
	}
	res.status(200).json({ data: document });
});

const searchQuiz = asyncHandler(async (req, res, next) => {
	const { quizName } = req.query || null;
	let result;
	try {
		[result] = await Quiz.fetchAll(quizName);
	} catch (err) {
		return next(new ApiError(err.message, 400));
	}
	res.status(200).json(result);
});
const fetchQuizByModule = asyncHandler(async (req, res, next) => {
	const { moduleId } = req.params;
	let data;
	try {
		const [result] = await Module.findById(moduleId);
		if (!result.length) {
			return next(new ApiError(`There is no Module for this Id`, 404));
		}
		[data] = await Quiz.findByIdModule(moduleId);
	} catch (err) {
		return next(new ApiError(err.message, 400));
	}

	res.status(200).json(data);
});
const fetchQuizByTeacher = asyncHandler(async (req, res, next) => {
	const { teacherId } = req.params;
	let data;
	try {
		const [[result]] = await Teacher.findById(teacherId);
		if (!result) {
			return next(new ApiError(`There is no Teacher for this Id`, 404));
		}
		[data] = await Quiz.findByIdTeacher(teacherId);
	} catch (err) {
		return next(new ApiError(err.message, 400));
	}

	res.status(200).json(data);
});
const getStudentQuiz = asyncHandler(async (req, res, next) => {
	let result;
	try {
		[result] = await Quiz.getStudentQuiz(req.user.id);
	} catch (err) {}
	res.status(200).json(result);
});
module.exports = {
	createQuiz,
	deleteQuiz,
	editQuiz,
	getQuizById,
	fetchQuizByModule,
	fetchQuizByTeacher,
	searchQuiz,
	getStudentQuiz,
};
