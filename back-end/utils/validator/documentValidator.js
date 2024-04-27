const { body, check } = require("express-validator");
const fs = require("fs");
const validatorMiddleware = require("../../middlewares/validator");

exports.documentValidator = [
	check("title")
		.notEmpty()
		.withMessage("title is Required"),
	check("type")
		.notEmpty()
		.withMessage(`type is required`)
		,
    check('file').custom((value,{req}) => {
            if (req.file) return true
            else throw 'file is required'
    })
        .withMessage("File does not exist"),
	validatorMiddleware,
];