const { body, check } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validator");

exports.addSpecialtyValidator = [
	check("specialty").notEmpty().withMessage("Should be a specialty"),
	check("className")
		.notEmpty()
		.withMessage("should Be A class for specialty")
		.isIn(["2CS", "3CS", "2cs", "3cs"])
		.withMessage("invalid class"),
	validatorMiddleware,
];

exports.updateSpecialtyValidator = [
	check("specialty").notEmpty().withMessage("Should be a specialty"),
	validatorMiddleware,
];
