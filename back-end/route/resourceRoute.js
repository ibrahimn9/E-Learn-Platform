const express = require("express");
const router = express.Router();

const {
	createResource,
	getResourceById,
	updateResource,
	deleteResource,
	getAllResources,
} = require("../controllers/resourceControllers");

const authServices = require("../controllers/authController");
// This route is Authorized For Teacher
// router.use(authServices.protect, authServices.allowedTo("teacher"));

router.route("/").post(createResource).get(getAllResources);
router
	.route("/:resourceId")
	.get(getResourceById)
	.put(updateResource)
	.delete(deleteResource);

module.exports = router;
