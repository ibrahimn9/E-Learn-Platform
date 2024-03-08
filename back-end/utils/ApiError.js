// @add description
// this class is responsible of operational errors (error that i can predict)

class ApiError extends Error {
	constructor(message, statusCode) {
		super(message);
		this.statusCode = statusCode;
		this.status = `${this.statusCode}`.startsWith(4) ? "failed" : "Error";
		this.isOperational = true;
	}
}


module.exports = ApiError;