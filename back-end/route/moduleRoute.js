const express = require("express");
const router = express.Router();
const {
  createModule,
  deleteModule,
  getModuleAll,
  getModuleById,
  updateModule,
} = require("../controllers/moduleController");

const { createModuleValidator } = require("../utils/validator/moduleValidator");

const authServices = require("../controllers/authController");
// Those End points Are Public
router.get("/", getModuleAll);
router.get("/:moduleId", getModuleById);
// Those EndPoints Are Authorized For Admin
router.post("/", createModuleValidator, createModule);
router.route("/:moduleId").delete(deleteModule).put(updateModule);

module.exports = router;
