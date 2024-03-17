const express = require("express");
const router = express.Router();
const {
	createCohort,
	deleteCohort,
	getCohortAll,
	getCohortById,
} = require("../controllers/cohorteController");

const { createCohortValidator } = require("../utils/validator/cohortValidator");

const authServices = require("../controllers/authController");
// This route is Authorized For Admin
router.use(authServices.protect, authServices.allowedTo("admin"));
router.route("/").post(createCohortValidator, createCohort).get(getCohortAll);
router.route("/:cohortId").get(getCohortById).delete(deleteCohort) ;

module.exports = router;
