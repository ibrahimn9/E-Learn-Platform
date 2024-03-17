const path = require("path");
const crypto = require("crypto");
const ejs = require("ejs");
const bcrypt = require("bcrypt");
const asyncHandler = require("express-async-handler");
const Student = require("../model/student.model.js");
const Teacher = require("../model/teacher.model.js");
const Admin = require("../model/admin.model.js");
const VerificationToken = require("../model/verificationToken.model.js");
const ApiError = require("../utils/ApiError.js");
const createToken = require("../utils/createToken.js");
const sendEmail = require("../utils/sendEmail.js");
const jwt = require("jsonwebtoken");

function capitalizeUserName(string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
}

/**-----------------------------------------------
 * @desc    Sign In New User
 * @route   /api/v1/auth/signIn
 * @method  POST
 * @access  public
------------------------------------------------*/

const signInController = asyncHandler(async (req, res, next) => {
	// 1.Check If user Exist (if it's (admin , teacher , student)  ) / Error if not Based On{Email / Password}
	const { email, password } = req.body;
	// Search for the user in every single table (Student , Teacher , Admin)
	let role;
	let userData; // Variable to hold user data
	// Search for student
	const [[student]] = await Student.findByEmail(email);
	if (student) {
		userData = student;
		role = "student";
	} else {
		// Search for teacher
		const [[teacher]] = await Teacher.findByEmail(email);
		if (teacher) {
			userData = teacher;
			role = "teacher";
		} else {
			// Search for admin
			const [[admin]] = await Admin.findByEmail(email);
			if (admin) {
				userData = admin;
				role = "admin";
			}
		}
	}
	// Compare The password With The hashed Password In Database
	if (!userData || !(await bcrypt.compare(password, userData.password))) {
		return next(new ApiError("Invalid email or password", 400));
	}
	//  2.Check if The user have signIn in our platform {isVerified}
	if (userData.isVerified) {
		// 3.generate token
		const token = createToken([userData.id, role], process.env.JWT_SECRET_KEY);
		res
			.cookie("access_token", token, {
				httpOnly: true,
				secure: process.env.NODE_ENV === "production",
			})
			.status(200)
			.json({ message: "Logged in successfully", userData, role });
	} else {
		// Check if Email Was Sent Before
		const to = await VerificationToken.findByUserIdAndRole(userData.id, role);
		if (to[0][0]) {
			return next(new ApiError("Email Already Sent", 401));
		}

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
				confirm_link: `${process.env.CLIENT_HOST}/api/v1/auth/${userData.id}/verify/${verificationToken.token}`,
				logoImage: "/img/photo_2024-03-08_18-31-04.jpg",
			})
			.then(async (result) => {
				emailTemplate = result;
				try {
					await sendEmail({
						email: userData.email,
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
 * @route   /api/v1/auth/:userId/verify/:token
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
	const DateExpiration = DateCreated.getTime() + 20 * 60 * 1000 - Date.now();
	if (!rows || DateExpiration < 0) {
		return next(new ApiError("Invalid Link Or Have Been Expired", 400));
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
		return next(new ApiError("Invalid Link", 401));
	}
	const [[userData]] = user;
	await VerificationToken.deleteById(rows.id);
	userData.isVerified = true;
	const { email, password } = userData;
	// 3.generate token
	const token = createToken([userData.id, role], process.env.JWT_SECRET_KEY);
	res
		.cookie("access_token", token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
		})
		.status(200)
		.json({ message: "Your account verified", userData, role });
});

// Authorization

const protect = asyncHandler(async (req, res, next) => {
	// 1) check if token exist
	let token;
	if (req.cookies["access_token"]) {
		token = req.cookies.access_token;
	}
	if (!token)
		return next(
			new ApiError(
				"You are not log in , Please log in to access to this route ",
				400
			)
		);

	// 2) verify the token (no changes happen , expired token ) :: if change happen in the payload or the token is expired
	const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

	// 3) verify if the user exist in database (this step is important when user is deleted by admin he also has the ability to access route because have the token )
	const role = decoded.role;
	if (role === "student") {
		// Searching in the students table
		user = await Student.findById(decoded.userId);
	} else if (role === "teacher") {
		// Searching in the teachers table
		user = await Teacher.findById(decoded.userId);
	} else {
		// Searching in the admins table
		user = await Admin.findById(decoded.userId);
	}
	if (!user) {
		return next(
			new ApiError(
				"The user that belong to this token has no longer exist ",
				400
			)
		);
	}
	req.role = role;
	req.user = user[0][0];
	next();
});

const allowedTo = (...roles) =>
	// 1) access roles ;
	// 2) access user register ;
	asyncHandler(async (req, res, next) => {
		if (!roles.includes(req.role)) {
			return next(
				new ApiError("You are not allowed to access this route ", 403)
			);
		}
		next();
	});

/**-----------------------------------------------
 * @desc    Sign out User
 * @route   /api/auth/logOut
 * @method  POST
 * @access  public
 ------------------------------------------------*/

const logoutController = asyncHandler(async (req, res, next) => {
	// Clear the access token cookie
	res.clearCookie("access_token");

	res.status(200).json({ message: "Logged out successfully" });
});

/**-----------------------------------------------
 * @desc    forget password for user
 * @route   /api/auth/forgot-password
 * @method  POST
 * @access  public
 ------------------------------------------------*/

const forgotPasswordController = asyncHandler(async (req, res, next) => {
	// 1. Validate user input
	const { email } = req.body;
	if (!email) {
		return next(new ApiError("Email is required", 400));
	}

	// 2. Generate reset token
	const token = crypto.randomBytes(32).toString("hex");

	// 3. Update user record with reset token
	let role;
	let userData;

	// Determine the type of user based on email domain or other criteria
	const [[student]] = await Student.findByEmail(email);
	if (student) {
		userData = student;
		role = "student";
	} else {
		// Search for teacher
		const [[teacher]] = await Teacher.findByEmail(email);
		if (teacher) {
			userData = teacher;
			role = "teacher";
		} else {
			// Search for admin
			const [[admin]] = await Admin.findByEmail(email);
			if (admin) {
				userData = admin;
				role = "admin";
			}
		}
	}

	if (!userData) {
		return next(new ApiError("User not found", 401));
	}

	let verificationToken;
	try {
		// Update reset token based on user type
		verificationToken = new VerificationToken(userData.id, token, role);
		await verificationToken.save();
	} catch (error) {
		return next(new ApiError("Failed to update reset token", 500));
	}

	// 4. Send reset instructions
	const resetLink = `http://localhost:5173/reset-password?token=${token}`;

	try {
		let emailTemplate;
		ejs
			.renderFile(path.join(__dirname, "../views/emailTemplate.ejs"), {
				user_fullName: capitalizeUserName(userData.fullName),
				confirm_link: resetLink,
				logoImage: "/img/photo_2024-03-08_18-31-04.jpg",
			})
			.then(async (result) => {
				emailTemplate = result;
				try {
					await sendEmail({
						email: userData.email,
						subject: "forgot-password Link to E-Learn Platform",
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
	} catch (error) {
		return next(new ApiError("Failed to send reset instructions", 500));
	}

	res
		.status(200)
		.json({ message: "Reset instructions sent to your email", token: token });
});

/**-----------------------------------------------
 * @desc    reset password for user
 * @route   /api/auth/reset-password/:token
 * @method  POST
 * @access  public
 ------------------------------------------------*/

const resetPasswordController = asyncHandler(async (req, res, next) => {
	const { newPassword } = req.body;
	const { token } = req.params;
	const [rows] = await VerificationToken.findByToken(token);

	// 1. Validate token and new password
	if (!rows[0]) {
		return next(new ApiError("Invalid Token", 400));
	}
	// 2. Verify token and update password
	let user;
	let data;
	let role = rows[0].role;

	// Find user by reset token
	if (role === "student") {
		user = await Student.findById(rows[0].idUser);
		data = user[0][0];
	} else if ((role = "teacher")) {
		user = await Teacher.findById(rows[0].idUser);
		data = user[0][0];
	} else {
		user = await Admin.findById(rows[0].idUser);
		data = user[0][0];
	}
	if (!data) {
		return next(new ApiError("Invalid or expired token", 400));
	}
	const hashedPw = await bcrypt.hash(newPassword, 12);
	// Update password based on user type
	if (role === "student") {
		await Student.updatePassword(hashedPw, data.id);
	} else if (role === "teacher") {
		await Teacher.updatePassword(hashedPw, data.id);
	} else if (user.role === "admin") {
		await Admin.updatePassword(hashedPw, data.id);
	}
	await VerificationToken.deleteById(rows[0].id);

	res.status(200).json({ message: "Password updated successfully" });
});

const resendEmail = asyncHandler(async (req, res, next) => {
	const { email } = req.body;
	// Search for the user in every single table (Student , Teacher , Admin)
	let role;
	let userData; // Variable to hold user data
	// Search for student
	const [[student]] = await Student.findByEmail(email);
	if (student) {
		userData = student;
		role = "student";
	} else {
		// Search for teacher
		const [[teacher]] = await Teacher.findByEmail(email);
		if (teacher) {
			userData = teacher;
			role = "teacher";
		} else {
			// Search for admin
			const [[admin]] = await Admin.findByEmail(email);
			if (admin) {
				userData = admin;
				role = "admin";
			}
		}
	}
	// Compare The password With The hashed Password In Database
	if (!userData) {
		return next(new ApiError("Invalid email", 401));
	}
	// Clear The Verification Token That was Sent
	await VerificationToken.deleteAll(userData.id, role);

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
					email: userData.email,
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
});

module.exports = {
	signInController,
	verifyUserAccountCtrl,
	logoutController,
	forgotPasswordController,
	resetPasswordController,
	resendEmail,
	allowedTo,
	protect,
};
