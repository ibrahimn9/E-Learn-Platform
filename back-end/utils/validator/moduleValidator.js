const { body, check } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validator");

exports.createModuleValidator = [
	check("name").notEmpty().withMessage("Module Name is required"),
	check("editor").notEmpty().withMessage("Should be An Editor For Module"),
	check("classes")
		.notEmpty()
		.withMessage("should Be A class for Module")
		.isArray()
		.withMessage("classes except to be Array"),
	check("teachers")
		.notEmpty()
		.withMessage("Should be Teachers For this Module")
		.isArray()
		.withMessage("teachers Should be array"),
	check("semester")
		.notEmpty()
		.withMessage("Should be a semester")
		.isIn(["S1", "S2"])
		.withMessage("Invalid semester"),
	validatorMiddleware,
];
