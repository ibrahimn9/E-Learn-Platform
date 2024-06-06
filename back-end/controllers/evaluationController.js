const ApiError = require("../utils/ApiError");
const asyncHandler = require("express-async-handler");
const AssignmentResult = require("../model/assignmentResult.model");
const Submission = require("../model/submission.model");
const evaluateSubmission = asyncHandler(async (req, res, next) => {
  const { status, studentId } = req.body;

  // Check if an evaluation already exists for the given student and assignment
  const [[submission]] = await Submission.findByStudentIdAndAssignmentId(
    req.params.assignmentId,
    studentId
  );

  if (!submission) {
    return next(new ApiError(`There is no submission for that`, 404));
  }

  // Check if an evaluation already exists for the given student and assignment
  const [existingEvaluation] =
    await AssignmentResult.findByAssignmentAndStudent(
      req.params.assignmentId,
      studentId
    );

  if (existingEvaluation) {
    // Update the status of the existing evaluation
    await AssignmentResult.updateStatus(
      req.params.assignmentId,
      studentId,
      status
    );
    res.status(200).json({ msg: "Evaluation updated successfully" });
  } else {
    // Create a new evaluation
    const evaluation = new AssignmentResult(
      req.params.assignmentId,
      studentId,
      status
    );
    await evaluation.save();
    res.status(201).json({ msg: "Evaluation added successfully" });
  }
});

const getAssignmentEvaluation = asyncHandler(async (req, res, next) => {
  const [result] = await AssignmentResult.findByAssignmentId(
    req.params.assignmentId
  );
  res.status(200).json({ data: result });
});

const getAssignmentResults = asyncHandler(async (req, res, next) => {
  try {
    const { assignmentId } = req.params;
    const [results] = await AssignmentResult.findByAssignmentId(assignmentId);
    res.status(200).json({ data: results });
  } catch (error) {
    console.error("Error getting assignment results:", error);
    res.status(500).json({ message: "Failed to retrieve assignment results" });
  }
});

module.exports = { getAssignmentEvaluation, evaluateSubmission };
