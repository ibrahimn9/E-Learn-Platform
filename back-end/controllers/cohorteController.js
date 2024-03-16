const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/ApiError");
const cohort = require("../model/cohort.model");
const Class = require("../model/class.model");
const associationCohortTeacher = require("../model/cohorte_teacher_association.model");

/**-----------------------------------------------
 * @desc    get cohort All
 * @route   /api/v1/cohort?className ,specialty= , groupNumber = 
 * @method  GET
 * @access  Admin
------------------------------------------------*/
const getCohortAll = asyncHandler(async (req, res, next) => {
	let dataClass;
	let { specialty, className } = req.query;
	// get the classId
	if (className) {
		[[dataClass]] = await Class.findByName(className, specialty);
		if (!dataClass) {
			return next(new ApiError(`there is no class with this name `, 400));
		}
	} 
	let { groupNumber } = req.query;
	const result = await cohort.fetchAll(dataClass.id, groupNumber, req.user.id);
	res.status(200).json({ data: result[0] });
});

/**-----------------------------------------------
 * @desc    get cohort By Id
 * @route   /api/v1/cohort/:cohortId
 * @method  GET
 * @access  Admin
------------------------------------------------*/

const getCohortById = asyncHandler(async (req, res, next) => {
	const { cohortId } = req.params;
	const result = await cohort.findById(cohortId, req.user.id);
	if (!result[0][0]) {
		return next(new ApiError(`There is no result `, 400));
	}
	res.status(200).json({ data: result[0][0] });
});

/**-----------------------------------------------
 * @desc    create new Cohort
 * @route   /api/v1/cohort
 * @method  POST
 * @access  Admin
------------------------------------------------*/

const createCohort = asyncHandler(async (req, res, next) => {
	// get the classId
	const [[dataClass]] = await Class.findByName(
		req.body.className.toUpperCase(),
		req.body.specialty
	);
	if (!dataClass) {
		return next(new ApiError(`there is no class with this name `, 400));
	}
	// get the data from body
	const { groupNumber } = req.body;
	// insert new Cohort
	const newCohort = new cohort(groupNumber, dataClass.id, req.user.id);
	const data = await newCohort.save();
	if (!data[0]) {
		return next(new ApiError(`there is error in creating cohort`, 400));
	}
	// Create the association cohort_module
	const { teachers } = req.body;
	teachers.map(async (teacherId) => {
		const association = new associationCohortTeacher(
			teacherId,
			data[0].insertId
		);
		await association.save();
	});

	res.status(201).json({ message: "Cohort Created" });
});

/**-----------------------------------------------
 * @desc    deleteCohort
 * @route   /api/v1/cohort/:cohortId
 * @method  DELETE
 * @access  Admin
------------------------------------------------*/

const deleteCohort = asyncHandler(async (req, res, next) => {
	const { cohortId } = req.params;
	// delete By Id Cohort All The Association behind this cohort cause the foreign key constraint
	await associationCohortTeacher.deleteByIdCohort(cohortId);
	// delete cohort from cohorts table
	await cohort.deleteById(cohortId);
	res.status(204).send();
});

module.exports = { createCohort, deleteCohort, getCohortAll, getCohortById };
