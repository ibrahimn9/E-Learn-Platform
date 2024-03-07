import jwt from "jsonwebtoken";

export default createToken = (payload) =>
	jwt.sign({ userId: payload }, process.env.JWT_SECRET_KEY, {
		expiresIn: process.env.ExpiresIn,
	});


