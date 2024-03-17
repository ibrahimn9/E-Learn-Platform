const { body, check } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validator");

exports.resetPasswordValidator = [
	check("newPassword")
		.notEmpty()
		.withMessage(`Password is required`)
		.isLength({ min: 6 })
		.withMessage(`Too short Password`),
	validatorMiddleware,
];
