const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/ApiError.js");
const Assignment = require("../model/assignment.model.js");
const multer = require("multer");
const File = require("../model/file.model.js");
const { v4: uuidv4 } = require("uuid");
const { uploadFile } = require("../utils/documentCloud.js");
const path = require("path");
const createAssignment = asyncHandler(async (req, res, next) => {
  const { moduleId, name, timeEnd, description } = req.body;
  const fileType = "assignment";
  const file = req.file;

  const uploadedLink = `/uploads/${file.filename}`;

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

const getStudentAssignments = asyncHandler(async (req, res, next) => {
  const { moduleId } = req.params;
  const [result] = await Assignment.getAll(moduleId);
  res.status(200).json({ data: result });
});
const getAssignmentFile = asyncHandler(async (req, res, next) => {
  try {
    const fileId = req.params.fileId;
    const [file] = await File.findById(fileId);

    if (!file || !file[0]) {
      return next(new ApiError("File not found", 404));
    }

    const filePath = path.join(__dirname, "..", "public", file[0].fileUrl);
    res.sendFile(filePath);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving file");
  }
});
module.exports = {
  createAssignment,
  getAssignmentFile,
  getAssignment,
  getAssignments,
  updateAssignment,
  deleteAssignment,
  getStudentAssignments
};
