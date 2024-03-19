const { body, check, validationResult } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validator");

exports.uploadValidator = [
  body("file")
    .custom((value, { req }) => {
      if (!req.file) {
        throw new Error("CSV file is required");
      }
      if (!req.file.mimetype.includes("csv")) {
        throw new Error("File must be a CSV");
      }
      return true;
    }),
  validatorMiddleware,
];

exports.uploadStudentValidator = [
  body("fullName")
    .notEmpty()
    .withMessage("Full name is required"),
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format"),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  body("idClass")
    .notEmpty()
    .withMessage("Class ID is required"),
  body("groupeNumber")
    .notEmpty()
    .withMessage("Group number is required"),
  validatorMiddleware // Your custom validator middleware to handle errors
];

exports.uploadTeacherValidator = [
  body("fullName")
    .notEmpty()
    .withMessage("Full name is required"),
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format"),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  validatorMiddleware // Your custom validator middleware to handle errors
];