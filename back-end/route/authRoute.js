const express = require("express");
const {
	signInController,
	verifyUserAccountCtrl,
	logoutController,
	forgotPasswordController,
	resetPasswordController
} = require("../controllers/authController.js");
const {signInValidator} = require("../utils/validator/authValidator.js")
const router = express.Router();

router.post("/signIn",signInValidator ,  signInController);
// /api/v1/auth/:userId/verify/:token
router.get("/:userId/verify/:token", verifyUserAccountCtrl);

// router.post('/forgot-password',forgotPasswordController);

// router.post('/reset-password/:token',resetPasswordController);

// router.post('/logOut',logoutController);

module.exports = router;
