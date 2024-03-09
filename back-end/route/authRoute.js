const express = require("express");
const {
	signInController,
	verifyUserAccountCtrl,
} = require("../controllers/authController.js");
const {signInValidator} = require("../utils/validator/authValidator.js")
const router = express.Router();

router.post("/signIn", signInValidator,signInController);
// /api/v1/auth/:userId/verify/:token
router.get("/:userId/verify/:token", verifyUserAccountCtrl);

module.exports = router;
