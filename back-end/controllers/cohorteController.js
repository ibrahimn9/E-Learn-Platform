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
	let dataClass = { id: null };
	let { specialty, className } = req.query;
	// get the classId
	if (className) {
		[[dataClass]] = await Class.findByName(className, specialty);
		if (!dataClass) {
			return next(new ApiError(`there is no class with this name `, 400));
		}
	}
	let { groupNumber } = req.query;
	const [result] = await cohort.fetchAll(
		dataClass.id,
		groupNumber,
		req.user.id
	);
	res.status(200).json({ data: result });
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
	let data;
	const newCohort = new cohort(groupNumber, dataClass.id, req.user.id);
	try {
		data = await newCohort.save();
	} catch (err) {
		if (err.code === "ER_DUP_ENTRY") {
			// Handle duplicate entry error
			return next(
				new ApiError(
					"Duplicate entry error: The combination of idClass and groupeNumber already exists.",
					400
				)
			);
		} else {
			throw new Error("Database error: Failed to insert the record.");
		}
	}
	// Create the association cohort_teacher
	const { teachers } = req.body;
	teachers.map(async (teacherId) => {
		const association = new associationCohortTeacher(
			teacherId,
			data[0].insertId
		);
		await association.save();
	});
	// create the association module_cohort
	const [modules] = await cohort.fetchModulesWithinClass(dataClass.id);

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
	const [[document]] = await cohort.findWithId(cohortId);
	if (!document) {
		return next(new ApiError(`No cohort for this id ${cohortId}`, 404));
	}
	
		await cohort.deleteById(cohortId);

	res.status(204).send();
});

module.exports = { createCohort, deleteCohort, getCohortAll, getCohortById };
