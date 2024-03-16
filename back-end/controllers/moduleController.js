const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/ApiError");
const cohort = require("../model/cohort.model");
const Class = require("../model/class.model");
const Teacher = require("../model/teacher.model");
const Module = require("../model/module.class");
const associationModuleTeacher = require("../model/module_teacher_association.model");
const associationCohortModule = require("../model/module_cohorte_association.model");

/**-----------------------------------------------
 * @desc    get Module By query Option(class ,semester ,specialty)
 * @route   /api/v1/module?name= ,profEditor ,class= ,semester= , specialty
 * @method  GET
 * @access  Public
------------------------------------------------*/
const getModuleAll = asyncHandler(async (req, res, next) => {
	// get the editor id [teacher]
	let dataClass, dataTeacher;
	if (req.query.editor) {
		[[dataTeacher]] = await Teacher.searchByNameOrEmail(req.query.editor);
		if (!dataTeacher) {
			return next(
				new ApiError(`there is no teacher  with this name or Email`, 400)
			);
		}
	}
	if (req.query.className) {
		// get the class id
		[[dataClass]] = await Class.findByName(
			req.query.className.toLocaleUpperCase()
		);
		if (!dataClass) {
			return next(new ApiError(`there is no class with this name `, 400));
		}
	}
	const { name, semester, specialty } = req.query;
	const result = await Module.fetchAll(
		name,
		dataTeacher.id,
		dataClass.id,
		semester,
		specialty
	);
	if (!result[0][0]) {
		return next(new ApiError(`There is no result for this request`, 400));
	}
	res.status(200).json({ data: result[0][0] });
});

/**-----------------------------------------------
 * @desc    get Module By id 
 * @route   /api/v1/module/:moduleId
 * @method  GET
 * @access  Public
------------------------------------------------*/

const getModuleById = asyncHandler(async (req, res, next) => {
	const { moduleId } = req.params;
	const result = await Module.findById(moduleId);
	if (!result[0][0]) {
		return next(new ApiError(`There is no result for this request`, 400));
	}
	res.status(200).json({ data: result[0][0] });
});

/**-----------------------------------------------
 * @desc    create new Module
 * @route   /api/v1/module
 * @method  POST
 * @access  Admin
------------------------------------------------*/

const createModule = asyncHandler(async (req, res, next) => {
	// get the editor id [teacher]
	const [[dataTeacher]] = await Teacher.searchByNameOrEmail(req.body.editor);
	if (!dataTeacher) {
		return next(
			new ApiError(`there is no teacher  with this name or Email`, 400)
		);
	}
	// get the class id
	const [[dataClass]] = await Class.findByName(
		req.body.className.toLocaleUpperCase()
	);
	if (!dataClass) {
		return next(new ApiError(`there is no class with this name `, 400));
	}
	// get the body data and insert new record in database
	const { name, semester, description, specialty } = req.body;
	const newModule = new Module(
		name,
		semester,
		description,
		specialty,
		dataTeacher.id,
		dataClass.id
	);
	const data = await newModule.save();
	if (!data[0]) {
		return next(new ApiError(`there is error in creating cohort`, 400));
	}
	// Handling the association now
	// association between modules And teachers
	// 1-Create the association cohort_module
	const { teachers } = req.body;
	teachers.map(async (teacherId) => {
		const association = new associationModuleTeacher(
			teacherId,
			data[0].insertId
		);
		await association.save();
	});
	// get the cohorts for the specified class
	const result = await cohort.findByClassId(dataClass.id);
	result[0].map(async (cohortId) => {
		const association = new associationCohortModule(
			data[0].insertId,
			cohortId.id
		);
		await association.save();
	});
	res.status(201).json({ message: "Module Created" });
});

/**-----------------------------------------------
 * @desc    delete Module
 * @route   /api/v1/cohort/:moduleId
 * @method  DELETE
 * @access  Admin
------------------------------------------------*/

const deleteModule = asyncHandler(async (req, res, next) => {
	const { moduleId } = req.params;
	// delete By Id Cohort All The Association behind this cohort cause the foreign key constraint
	await associationCohortModule.deleteByIdModule(moduleId);
	await associationModuleTeacher.deleteByIdModule(moduleId);
	// delete cohort from cohorts table
	await Module.deleteById(moduleId);
	res.status(204).send();
});

/**-----------------------------------------------
 * @desc    update Module Editor
 * @route   /api/v1/cohort/:moduleId
 * @method  PATCH
 * @access  Admin
------------------------------------------------*/

const updateModuleEditor = asyncHandler(async (req, res, next) => {
	// update the editor
	// get the editor id [teacher]
	const [[dataTeacher]] = await Teacher.searchByNameOrEmail(req.body.editor);
	if (!dataTeacher) {
		return next(
			new ApiError(`there is no teacher  with this name or Email`, 400)
		);
	}
	await Module.updateEditor(dataTeacher.id, req.params.moduleId);
	res.status(200).json({ message: "Module Editor Updated" });
});
module.exports = { createModule, deleteModule, updateModuleEditor };
