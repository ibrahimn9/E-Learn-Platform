const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/ApiError.js");
const Class = require("../model/class.model.js");

const addSpecialty = asyncHandler(async (req, res, next) => {
	const { className, specialty } = req.body;
		try {
			const newClass = new Class(className.toUpperCase(), specialty);
			await newClass.save();
		} catch (err) {
			if (err.code === "ER_DUP_ENTRY") {
				// Handle duplicate entry error
				return next(
					new ApiError(
						"Duplicate entry error: The combination of name and specialty already exists In class",
						400
					)
				);
			} else {
				throw new Error("Database error: Failed to insert the record.");
			}
		}
	
	res.status(201).json({ message: "Specialty Added" });
});

const getClassById = asyncHandler(async (req, res, next) => {
	const [[data]] = await Class.fetchById(req.params.classId);
	res.status(200).json({ data });
});

const getClassAll = asyncHandler(async (req, res, next) => {
	const { className, specialty } = req.query;
	const [[data]] = await Class.findByName(className, specialty);
	res.status(200).json({ data });
});

const updateSpecialty = asyncHandler(async (req, res, next) => {
	const { specialty } = req.body;
	await Class.updateSpecialty(specialty, req.params.classId);
	res.status(200).json({ message: "Specialty Updated" });
});

const deleteSpecialty = asyncHandler(async (req, res, next) => {
	await Class.deleteById(req.params.classId);
	res.status(204).send();
});

module.exports = {
	deleteSpecialty,
	getClassAll,
	getClassById,
	addSpecialty,
	updateSpecialty,
};
