const ApiError = require("../utils/ApiError");
const asyncHandler = require("express-async-handler");
const AssignmentResult = require("../model/assignmentResult.model");
const Submission = require("../model/submission.model");
const evaluateSubmission = asyncHandler(async (req, res, next) => {
	const { status, studentId } = req.body;
	// check if the pair (studentId, assignmentId exists in submission Table)
	const [[submission]] = await Submission.findByStudentIdAndAssignmentId(
		req.params.assignmentId,
		studentId
  );
	if (!submission) {
		return next(new ApiError(`There is no submission For That`, 404));
	}
	const evaluation = new AssignmentResult(
		req.params.assignmentId,
		studentId,
		status
	);
	await evaluation.save();
	res.status(201).json({ msg: "Evaluation Added" });
});
const getAssignmentEvaluation = asyncHandler(async (req, res, next) => {
	const [result] =await  AssignmentResult.findByAssignmentId(req.params.assignmentId);
	res.status(200).json({ data: result });
});

module.exports = { getAssignmentEvaluation, evaluateSubmission };