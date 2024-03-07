import express from "express";
import asyncHandler from "express-async-handler";
import Student from "../model/student.model.js";
import Teacher from "../model/teacher.model.js";
import Admin from "../model/admin.model.js";
import ApiError from "../utils/ApiError.js";

/**-----------------------------------------------
 * @desc    Sign In New User
 * @route   /api/auth/signIn
 * @method  POST
 * @access  public
 ------------------------------------------------*/

export const signInController = asyncHandler(async (req, res, next) => {
	// 1.Check If user Exist (if it's (admin , teacher , student)  ) / Error if not Based On{Email / Password}
	const { email, password } = req.body;
	// Search for the user in a single table
	let role;
	let userData; // Variable to hold user data
	if (await Student.findByEmailAndPassword(email, password)) {
		var [[user], fields] = await Student.findByEmailAndPassword(
			email,
			password
		);
		role = "student";
		userData = user;
	} else if (await Teacher.findByEmailAndPassword(email, password)) {
		var [[user], fields] = await Teacher.findByEmailAndPassword(
			email,
			password
		);
		role = "teacher";
		userData = user;
	} else if (await Admin.findByEmailAndPassword(email, password)) {
		var [[user], fields] = await Admin.findByEmailAndPassword(email, password);
		role = "admin";
		userData = user;
	}

	if (!role) {
		// Handle case when user not found
		return next(
			new ApiError(
				`There is no account with the provided email/password. Please try again.`,
				401
			)
		);
	}
	//  2.Check if The user have signIn in our platform {isVerified}
	if (userData.isVerified) {
		console.log(`Bravo !!!`);
	} else console.log(userData.isVerified);
});
