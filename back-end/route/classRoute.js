const express = require("express");
const router = express.Router();

const {
	deleteSpecialty,
	getClassAll,
	getClassById,
	addSpecialty,
	updateSpecialty,
} = require("../controllers/classControllers");
const {
	addSpecialtyValidator,
	updateSpecialtyValidator,
} = require("../utils/validator/classValidator");

const authServices = require("../controllers/authController");
// This route is Authorized For Admin
router.use(authServices.protect, authServices.allowedTo("admin"));

router.route("/").post(addSpecialtyValidator, addSpecialty).get(getClassAll);
router
	.route("/:classId")
	.get(getClassById)
	.delete(deleteSpecialty)
	.put(updateSpecialtyValidator, updateSpecialty);

module.exports = router;
