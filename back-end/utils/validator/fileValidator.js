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