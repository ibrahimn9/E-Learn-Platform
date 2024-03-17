const express = require("express");
const router = express.Router();

const {
	deleteSpecialty,
	getClassAll,
	getClassById,
	addSpecialty,
	updateSpecialty,
} = require("../controllers/classControllers");

const authServices = require("../controllers/authController");
// This route is Authorized For Admin
router.use(authServices.protect, authServices.allowedTo("admin"));

router.route("/").post(addSpecialty).get(getClassAll);
router
	.route("/:cohortId")
	.get(getClassById)
	.delete(deleteSpecialty)
	.put(updateSpecialty);

module.exports = router;
