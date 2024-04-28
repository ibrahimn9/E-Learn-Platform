const { body, check } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validator");

exports.createCohortValidator = [
	check("teachers")
		.notEmpty()
		.withMessage("Should be Teachers For this cohort")
		.isArray()
		.withMessage("teachers Should be array"),
	check("groupNumber")
		.notEmpty()
		.withMessage("Should be a number for cohort")
		.isNumeric()
		.withMessage("should be a numeric value"),
	check("className")
		.notEmpty()
		.withMessage("should Be A class for Module")
		.isIn([
			"1CPI",
			"2CPI",
			"1CS",
			"2CS",
			"3CS",
			"1cpi",
			"2cpi",
			"1cs",
			"2cs",
			"3cs",
		])
		.withMessage("invalid class"),
	check("specialty")
		.optional()
		.custom((value, { req }) => {
			if (!["2cs", "3cs", "2CS", "3CS"].includes(req.body.className))
				throw new Error(`The ${value} Is in The Wrong Class `);
			return true;
		}),
	validatorMiddleware,
];
