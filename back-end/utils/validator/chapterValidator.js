const { body, check } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validator");

exports.chapterValidator = [
	check("title")
		.notEmpty()
		.withMessage("title Required"),
	check("moduleId")
		.notEmpty()
		.withMessage(`module is required`)
		,
	validatorMiddleware,
];