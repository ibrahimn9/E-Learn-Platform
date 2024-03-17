const express = require("express");
const router = express.Router();

const { getUserAll, getUserById } = require("../controllers/userControllers");

const authServices = require("../controllers/authController");
// This route is Authorized For Admin
router.use(authServices.protect, authServices.allowedTo("admin"));

router.route("/").get(getUserAll);
router.route("/:userId").get(getUserById);

module.exports = router;
