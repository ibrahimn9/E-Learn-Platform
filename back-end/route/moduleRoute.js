const express = require("express");
const router = express.Router();
const {
	createModule,
	deleteModule,
	getModuleAll,
	getModuleById,
} = require("../controllers/moduleController");

const { createModuleValidator } = require("../utils/validator/moduleValidator");

const authServices = require("../controllers/authController");
// Those End points Are Public
router.get("/", authServices.protect, getModuleAll);
router.get("/:moduleId", authServices.protect, getModuleById);
// Those EndPoints Are Authorized For Admin
router.use(authServices.protect, authServices.allowedTo("admin"));
router.post("/", createModuleValidator, createModule);
router.delete("/:moduleId", deleteModule);

module.exports = router;
