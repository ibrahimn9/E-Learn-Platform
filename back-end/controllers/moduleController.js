const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/ApiError");
const Class = require("../model/class.model");
const Teacher = require("../model/teacher.model");
const Module = require("../model/module.model");
const associationModuleTeacher = require("../model/module_teacher_association.model");
const associationCohortModule = require("../model/module_cohorte_association.model");
const associationModuleClass = require("../model/class_module_association.model");

/**-----------------------------------------------
 * @desc    get Module By query Option(class ,semester ,specialty)
 * @route   /api/v1/module?class= ,semester= , specialty
 * @method  GET
 * @access  Public
------------------------------------------------*/
const getModuleAll = asyncHandler(async (req, res, next) => {
	// get the editor id [teacher]
	let dataTeacher = { id: null },
		dataClass = { id: null };
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
			req.query.className.toLocaleUpperCase(),
			req.query.specialty
		);
		if (!dataClass) {
			return next(new ApiError(`there is no class with this name `, 400));
		}
	}
	const { name, semester } = req.query;
	const result = await Module.fetchAll(
		name,
		dataTeacher.id,
		dataClass.id,
		semester
	);
	res.status(200).json({ data: result[0] });
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
	// get the classes id
	let classesIds = [];
	const classes = req.body.classes;
	await Promise.all(
		classes.map(async (value) => {
			let specialty;
			if (Array.isArray(value)) {
				specialty = value[1];
				value = value[0];
			}
			const [[dataClass]] = await Class.findByName(
				value.toLocaleUpperCase(),
				specialty
			);
			if (!dataClass) {
				return next(
					new ApiError(`There is no class with the name '${value}'`, 400)
				);
			}
			classesIds.push(dataClass.id);
		})
	);
	const { teachers } = req.body;
	if (!teachers.includes(dataTeacher.id)) {
		return next(new ApiError(`The Editor Must Include In Teachers`, 400));
	}
	// get the body data and insert new record in database
	const { name, semester, description } = req.body;
	const newModule = new Module(name, semester, description, dataTeacher.id);
	const data = await newModule.save();
	if (!data[0]) {
		return next(new ApiError(`there is error in creating cohort`, 400));
	}
	// Handling the association now
	// association between modules And teachers
	// 1-Implement the association module_teacher
	await Promise.all(
		teachers.map(async (teacherId) => {
			const association = new associationModuleTeacher(
				data[0].insertId,
				teacherId
			);
			await association.save();
		})
	);
	// 2-Implement the association module_class
	let cohortIds = [];
	await Promise.all(
		classesIds.map(async (classId) => {
			const association = new associationModuleClass(data[0].insertId, classId);
			await association.save();
			// get the cohorts for the specified class
			const [result] = await Module.fetchCohortsByClassIdAndModuleId(
				data[0].insertId,
				classId
			);
			for (i = 0; i < result.length; i++) {
				if (result[i].id !== null) {
					cohortIds.push(result[i].id);
				}
			}
		})
	);
	// 3-Implement the association module_cohort
	cohortIds.map(async (cohortId) => {
		const association = new associationCohortModule(cohortId, data[0].insertId);
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
	const [[document]] = await Module.findById(moduleId);
		if (!document) {
			return next(new ApiError(`No Module for this id ${moduleId}`, 404));
		}
	await Module.deleteById(moduleId);
	res.status(204).send();
});

/**-----------------------------------------------
 * @desc    update Module Editor
 * @route   /api/v1/cohort/:moduleId
 * @method  PUT
 * @access  Admin
------------------------------------------------*/

const updateModule = asyncHandler(async (req, res, next) => {
	// update the editor
	// get the editor id [teacher]
	let dataTeacher = { id: null };
	if (req.body.editor) {
		[[dataTeacher]] = await Teacher.searchByNameOrEmail(req.body.editor);
		if (!dataTeacher) {
			return next(
				new ApiError(`there is no teacher  with this name or Email`, 400)
			);
		}
		const [[module]] = await Module.findById(req.params.moduleId);
		if (module.idEditor === dataTeacher.id) {
			return next(
				new ApiError(`This Teacher is Already Editor for this module `, 400)
			);
		}
		try {
			const association = new associationModuleTeacher(
				req.params.moduleId,
				dataTeacher.id
			);
			await association.save();
		} catch (err) {
			if (err.code === "ER_DUP_ENTRY") {
				await associationModuleTeacher.deleteByIdModuleAndTeacherId(
					req.params.moduleId,
					dataTeacher.id
				);
				const association = new associationModuleTeacher(
					req.params.moduleId,
					dataTeacher.id
				);
				await association.save();
			} else {
				throw new Error("Database error: Failed to insert the record.");
			}
		}
	}
	if (req.body.teachers) {
		if (!req.body.teachers.includes(dataTeacher.id)) {
			return next(new ApiError(`The Editor Must Include In Teachers`, 400));
		}
		// update the teacher-module association (by deleting and inserting new one)
		// await associationModuleTeacher.deleteByIdModule(req.params.moduleId);
		// association between modules And teacher
		await Promise.all(
			req.body.teachers.map(async (teacherId) => {
				const association = new associationModuleTeacher(
					req.params.moduleId,
					teacherId
				);
				try {
					await association.save();
				} catch (err) {
					if (err.code === "ER_DUP_ENTRY") {
						// Handle duplicate entry error
						return next(
							new ApiError(
								"Duplicate entry error: The  Teacher are already exists In Module",
								400
							)
						);
					} else {
						throw new Error("Database error: Failed to insert the record.");
					}
				}
			})
		);
	}
	const { name, description, semester } = req.body;
	const data = await Module.updateEditor(
		name,
		description,
		semester,
		dataTeacher.id,
		req.params.moduleId
	);

	res.status(200).json({ message: "Module Updated" });
});
module.exports = {
	getModuleAll,
	getModuleById,
	createModule,
	deleteModule,
	updateModule,
};
