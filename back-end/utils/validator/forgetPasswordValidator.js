const { body, check } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validator");

exports.forgetPasswordValidator = [
	check("email")
		.notEmpty()
		.withMessage("Email Required")
		.isEmail()
		.withMessage("Invalid Email"),
	// .custom((value) => {
	// 	// Add custom validation logic, e.g., check if the email is from a specific domain.
	// 	if (!value.endsWith("@esi-sba.dz")) {
	// 		throw new Error("Use Your School Email");
	// 	}
	// 	return true;
	// }),
	validatorMiddleware,
];
