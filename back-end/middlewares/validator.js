const { validationResult } = require("express-validator");
// 2=>set Middlewares to catch Error From the rules
const validatorMiddleware = (req, res, next) => {
	const result = validationResult(req);
	if (!result.isEmpty()) {
		return res.status(400).send({ errors: result.array() });
	}
	next();
};

module.exports = validatorMiddleware;
