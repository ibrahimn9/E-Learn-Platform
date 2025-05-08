const ApiError = require("../utils/ApiError");
const asyncHandler = require("express-async-handler");
const Submission = require("../model/submission.model.js");
const File = require("../model/file.model.js");
const { uploadFile } = require("../utils/documentCloud.js");
const path = require("path");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");

const submitAssignment = asyncHandler(async (req, res, next) => {
  try {
    const fileType = "submission";
    const file = req.file;

    if (!file) {
      return next(new ApiError("Aucun fichier soumis", 400));
    }

    const fileExtension = path.extname(file.originalname);
    const newFileName = `${Date.now()}-${file.originalname}`;
    const filePath = `./public/uploads/${newFileName}`;
    const fileUrl = `/uploads/${newFileName}`;


    fs.renameSync(file.path, filePath);
    console.log("hi");

    // Save submission
    const submission = new Submission(
      req.params.assignmentId,
      req.user.id,
      1,
      fileUrl // save local URL
    );
    await submission.save();

    // Save file metadata
    const newFile = new File(
      req.user.id,
      req.params.assignmentId,
      file.originalname,
      fileUrl,
      fileType
    );
    await newFile.save();

    res.status(200).json({ msg: "Submission ajoutée avec succès" });
  } catch (error) {
    next(new ApiError("Erreur lors de la soumission : " + error.message, 500));
  }
});
const showUserSubmission = asyncHandler(async (req, res, next) => {
  // show the user submission
  const [result] = await Submission.findByStudentId(req.user.id);
  res.status(200).json({ data: result });
});
const showAssignmentSubmission = asyncHandler(async (req, res, next) => {
  // show the user submission
  console.log(req.params.assignmentId);
  const [result] = await Submission.findByStudentId(req.params.assignmentId);
  res.status(200).json({ data: result });
});
module.exports = {
  submitAssignment,
  showUserSubmission,
  showAssignmentSubmission,
};
