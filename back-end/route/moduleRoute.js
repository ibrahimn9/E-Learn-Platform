const express = require("express");
const router = express.Router();
const {
	createModule,
	deleteModule,
} = require("../controllers/moduleController");

const { createModuleValidator } = require("../utils/validator/moduleValidator");

const authServices = require("../controllers/authController");
// This route is Authorized For Admin
router.use(authServices.protect, authServices.allowedTo("admin"));
router.post("/", createModuleValidator, createModule);
router.delete("/:moduleId", deleteModule);

module.exports = router;
