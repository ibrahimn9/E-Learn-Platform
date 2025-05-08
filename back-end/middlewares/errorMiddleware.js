require('dotenv').config();

const sendErrorForDev = (err, res) =>
	res.status(400).json({
		status: err.status,
		err,
		message: err.message,
		stack: err.stack,
	});

const sendErrorForPro = (err, res) =>
	res.status(400).json({
		status: err.status,
		message: err.message,
	});

const globalError = (err, req, res, next) => {
	err.statusCode = err.statusCode || 500;
	err.status = err.status || "Error";
	if (process.env.NODE_ENV === "development") {
		sendErrorForDev(err, res);
	} else {
		sendErrorForPro(err, res);
	}
};

module.exports = globalError;
