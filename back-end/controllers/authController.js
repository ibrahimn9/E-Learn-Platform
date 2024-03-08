const path = require("path");
const crypto = require("crypto");
const express = require("express");
const ejs = require("ejs");
const asyncHandler = require("express-async-handler");
const Student = require("../model/student.model.js");
const Teacher = require("../model/teacher.model.js");
const Admin = require("../model/admin.model.js");
const VerificationToken = require("../model/verificationToken.model.js");
const ApiError = require("../utils/ApiError.js");
const createToken = require("../utils/createToken.js");
const sendEmail = require("../utils/sendEmail.js");
const axios = require("axios");

function capitalizeUserName(string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
}

/**-----------------------------------------------
 * @desc    Sign In New User
 * @route   /api/auth/signIn
 * @method  POST
 * @access  public
 ------------------------------------------------*/

const signInController = asyncHandler(async (req, res, next) => {
	// 1.Check If user Exist (if it's (admin , teacher , student)  ) / Error if not Based On{Email / Password}
	const { email, password } = req.body;
	// Search for the user in a single table
	let role;
	let userData; // Variable to hold user data
	// Search for student
	const [[student]] = await Student.findByEmailAndPassword(email, password);
	if (student) {
		userData = student;
		role = "student";
	} else {
		// Search for teacher
		const [[teacher]] = await Teacher.findByEmailAndPassword(email, password);
		if (teacher) {
			userData = teacher;
			role = "teacher";
		} else {
			// Search for admin
			const [[admin]] = await Admin.findByEmailAndPassword(email, password);
			if (admin) {
				userData = admin;
				role = "admin";
			}
		}
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
		// 3.generate token
		const token = createToken(
			[userData.id, userData.email],
			process.env.JWT_SECRET_KEY
		);
		res
			.cookie("access_token", token, {
				httpOnly: true,
				secure: process.env.NODE_ENV === "production",
			})
			.status(200)
			.json({ message: "Logged in successfully", userData, role });
	} else {
		// 3.create new verification token
		// Creating new VerificationToken & save it toDB
		const token = crypto.randomBytes(32).toString("hex");
		const verificationToken = new VerificationToken(userData.id, token, role);
		await verificationToken.save();
		// 4.Send Link To User Email That will verify him
		let emailTemplate;
		ejs
			.renderFile(path.join(__dirname, "../views/emailTemplate.ejs"), {
				user_fullName: capitalizeUserName(userData.fullName),
				confirm_link: `${process.env.CLIENT_DOMAIN}/api/v1/auth/${userData.id}/verify/${verificationToken.token}`,
				logoImage: "/img/photo_2024-03-08_18-31-04.jpg",
			})
			.then(async (result) => {
				emailTemplate = result;
				try {
					await sendEmail({
						email: capitalizeUserName(userData.email),
						subject: "Verification Link to E-Learn Platform",
						message: emailTemplate,
					});
				} catch (err) {
					return next(
						new ApiError(
							"There is an error in the Sending Email . Please try again",
							500
						)
					);
				}
			})
			.catch((err) => {
				return next(
					new ApiError(
						"Email Was Not Sent , Error While Rendering the Ejs file "
					),
					401
				);
			});
		res.status(200).json({ message: `Email Verification Was sent To user` });
	}
});

/**-----------------------------------------------
 * @desc    Verify User Account
 * @route   /api/auth/:userId/verify/:token
 * @method  GET
 * @access  public
 ------------------------------------------------*/
const verifyUserAccountCtrl = asyncHandler(async (req, res, next) => {
	const verificationToken = await VerificationToken.findOne(
		req.params.userId,
		req.params.token
	);
	const [[rows], fields] = verificationToken;
	const DateCreated = new Date(rows.created_at);
	const DateExpiration = Date.now() - (DateCreated.getTime() + 20 * 60 * 1000 );
	if (!rows || DateExpiration > 0) {
		return next(new ApiError("Invalid Link Or Have Been Expired"), 401);
	}
	let user;
	const role = rows.role;

	if (role === "student") {
		// Searching in the students table
		user = await Student.findById(req.params.userId);
		await Student.updateUserVerified(true, req.params.userId);
	} else if (role === "teacher") {
		// Searching in the teachers table
		user = await Teacher.findById(req.params.userId);
		await Teacher.updateUserVerified(true, req.params.userId);
	} else {
		// Searching in the admins table
		user = await Admin.findById(req.params.userId);
		await Admin.updateUserVerified(true, req.params.userId);
	}
	if (!user) {
		return next(new ApiError("Invalid Link"), 401);
	}
	const [[userData]] = user;
	await VerificationToken.deleteById(rows.id);
	userData.isVerified = true;
	const { email, password } = userData;
	console.log(email, password);
	// Making an HTTP GET request to another route '/route2'
	const response = await axios.post(
		`${process.env.CLIENT_DOMAIN}/api/v1/auth/signIn`,
		{ email, password }
	);
	// 3.generate token
	const token = createToken(
		[userData.id, userData.email],
		process.env.JWT_SECRET_KEY
	);
	res
		.cookie("access_token", token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
		})
		.status(200)
		.json({ message: "Your account verified", userData, role });
});

module.exports = { signInController, verifyUserAccountCtrl };
