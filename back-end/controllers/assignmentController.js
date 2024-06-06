const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/ApiError.js");
const Assignment = require("../model/assignment.model.js");
const multer = require("multer");
const File = require("../model/file.model.js");
const { v4: uuidv4 } = require("uuid");
const { uploadFile } = require("../utils/documentCloud.js");
const createAssignment = asyncHandler(async (req, res, next) => {
  // save into assignment table
  const { moduleId, name, timeEnd, description } = req.body;

  const fileType = "assignment";

  // save the files
  const file = req.file;
  const link = await uploadFile(file);
  const uploadedLink = link.id



  const assignment = new Assignment(
    name,
    description,
    req.user.id,
    moduleId,
    timeEnd,
    uploadedLink
  );

  const result = await assignment.save();

  const newFile = new File(
    null,
    result[0].insertId,
    file.originalname,
    uploadedLink,
    fileType
  );
  await newFile.save();
  res.status(201).json({ msg: `Assignment Created Successfully` });
});

const deleteAssignment = asyncHandler(async (req, res, next) => {
  const [[document]] = await Assignment.findById(req.params.assignmentId);
  if (!document) {
    return next(
      new ApiError(`No Assignment for this id ${req.params.assignmentId}`, 404)
    );
  }
  await Assignment.deleteById(req.params.assignmentId);
  res.status(204).send();
});
const updateAssignment = asyncHandler(async (req, res, next) => {
  const { name, description, moduleId, timeEnd } = req.body;
  if (timeEnd) {
    const endDate = new Date(timeEnd);
    if (endDate.getTime() < new Date().getTime() + duration) {
      return next(new ApiError(`Invalid End Time `, 400));
    }
  }
  let result;
  try {
    [result] = await Assignment.updateAssignment(
      req.params.assignmentId,
      name,
      description,
      moduleId,
      timeEnd
    );
  } catch (err) {
    return next(new ApiError(err.message, 400));
  }
  res.status(200).json({ msg: "Assignment Updated" });
});
const getAssignment = asyncHandler(async (req, res, next) => {
  const [[document]] = await Assignment.findById(req.params.assignmentId);
  if (!document) {
    return next(new ApiError(`There is no Assignment For this Id`, 404));
  }
  res.status(200).json({ data: document });
});
const getAssignments = asyncHandler(async (req, res, next) => {
  const { teacherId, moduleId } = req.query;
  const [result] = await Assignment.fetchAll(teacherId, moduleId);
  res.status(200).json({ data: result });
});
const getAssignmentFile = asyncHandler(async (req, res, next) => {
  try {
    const fileId = req.params.fileId;
    const [file] = await File.findById(fileId);
    const data = await downloadFile(file[0].fileUrl);
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${data.result.name}"`
    );
    res.setHeader("Content-Type", "application/octet-stream");
    res.end(Buffer.from(data.result.fileBinary), "binary");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching file from Dropbox");
  }
});
module.exports = {
  createAssignment,
  getAssignmentFile,
  getAssignment,
  getAssignments,
  updateAssignment,
  deleteAssignment,
};
