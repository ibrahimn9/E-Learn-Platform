const ApiError = require("../utils/ApiError");
const asyncHandler = require("express-async-handler");
const Submission = require("../model/submission.model.js");
const File = require("../model/file.model.js");
const { uploadFile } = require("../utils/documentCloud.js");

const submitAssignment = asyncHandler(async (req, res, next) => {
  const fileType = "submission";
  // save the files
  const file = req.file;

  
  const uploadedLink = await uploadFile(file);



  const submission = new Submission(req.params.assignmentId, req.user.id, 1, uploadedLink.id);
  await submission.save();

  const newFile = new File(
    req.user.id,
    req.params.assignmentId,
    file.originalname,
    uploadedLink,
    fileType
  );
  await newFile.save();
  res.status(200).json({ msg: "submission Added" });
});
const showUserSubmission = asyncHandler(async (req, res, next) => {
  // show the user submission
  const [result] = await Submission.findByStudentId(req.user.id);
  res.status(200).json({ data: result });
});
const showAssignmentSubmission = asyncHandler(async (req, res, next) => {
  // show the user submission
  console.log(req.params.assignmentId)
  const [result] = await Submission.findByStudentId(req.params.assignmentId);
  res.status(200).json({ data: result });
});
module.exports = {
  submitAssignment,
  showUserSubmission,
  showAssignmentSubmission,
};
