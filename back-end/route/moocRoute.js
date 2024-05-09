const express = require("express");
const router = express.Router();

const {
	uploadMooc,
	getAllMooc,
	getMoocById,
	updateMooc,
	deleteMooc,
	getMoocByModule,
} = require("../controllers/moocsControllers");

const authServices = require("../controllers/authController");
// This route is Authorized For Admin
router.use(authServices.protect);

router.post("/upload", uploadMooc);
router.get("/", getAllMooc);
router.route("/:moocId").get(getMoocById).put(updateMooc).delete(deleteMooc);
router.get("/module/:idModule", getMoocByModule);

module.exports = router;
