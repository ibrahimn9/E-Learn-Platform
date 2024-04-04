const express = require("express");
const {
  signInController,
  verifyUserAccountCtrl,
  logoutController,
  forgotPasswordController,
  resetPasswordController,
  resendEmail,
  verifytoken
} = require("../controllers/authController.js");
const { signInValidator } = require("../utils/validator/authValidator.js");
const {
  forgetPasswordValidator,
} = require("../utils/validator/forgetPasswordValidator.js");
const {
  resetPasswordValidator,
} = require("../utils/validator/resetPasswordValidator.js");
const router = express.Router();

router.post("/signIn", signInValidator, signInController);
// /api/v1/auth/:userId/verify/:token
router.get("/:userId/verify/:token", verifyUserAccountCtrl);

router.post("/resend-Email", forgetPasswordValidator, resendEmail);

router.post(
  "/forgot-password",
  forgetPasswordValidator,
  forgotPasswordController
);

router.post('/verifytoken',verifytoken);

router.post(
  "/reset-password/:token",
  resetPasswordValidator,
  resetPasswordController
);

router.post("/logOut", logoutController);

module.exports = router;
