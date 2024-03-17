const jwt = require("jsonwebtoken");

const createToken = (payload) =>
	jwt.sign(
		{ userId: payload[0], role: payload[1] },
		process.env.JWT_SECRET_KEY,
		{
			expiresIn: process.env.ExpiresIn,
		}
	);

module.exports = createToken;
