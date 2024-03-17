const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/ApiError.js");
const Class = require("../model/class.model.js");

const addSpecialty = asyncHandler(async (req, res, next) => {
	const { className, specialty } = req.body;
	const newClass = Class(className, specialty);
	await newClass.save();
	res.status(200).json({ message: "Specialty Added" });
});

const getClassById = asyncHandler(async (req, res, next) => {
	const [[data]] = await Class.fetchById(req.params.idClass);
	res.status(200).json({ data });
});

const getClassAll = asyncHandler(async (req, res, next) => {
	const { className, specialty } = req.query;
	const [[data]] = await Class.findByName(className, specialty);
	res.status(200).json({ data });
});

const updateSpecialty = asyncHandler(async (req, res, next) => {
	const { specialty } = req.body;
	await Class.updateSpecialty(specialty, req.params.idClass);
	res.status(200).json({ message: "Specialty Updated" });
});

const deleteSpecialty = asyncHandler(async (req, res, next) => {
	await Class.deleteById(req.params.idClass);
	res.status(200).json({ message: "Specialty Updated" });
});

module.exports = {
	deleteSpecialty,
	getClassAll,
	getClassById,
	addSpecialty,
	updateSpecialty,
};
