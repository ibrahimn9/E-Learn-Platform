const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/ApiError.js");
const Quiz = require("../model/quiz.model.js");
const Question = require("../model/question.model.js");
const Option = require("../model/option.model.js");
const Result = require("../model/result.model.js");
const studentQuizzes = require("../model/quiz_student-association.model.js");
const Student = require("../model/student.model.js");

const submitResult = asyncHandler(async (req, res, next) => {
  // check if the quiz isn't over time
  const [[quiz]] = await Quiz.findById(req.body.quiz);

  // check if the submit
  const { responses } = req.body;
  let userScore = 0;

  // change the quizTaken Attribute To True
  await studentQuizzes.setQuiz(req.body.quiz, req.user.id);
  // -- Calculate The Score
  // get the questions Ids Quiz
  const [questions] = await Question.getQuestionsIdsAndNote(req.body.quiz);
  if (questions.length) {
    for (const question of questions) {
      // get the user responses for this question
      const response = responses.find(
        (response) => response.questionId == question.id
      );
      if (response) {
        // get the right options and compare it with the student options
        const [rightAnswers] = await Option.getRightOptionsOfQuestion(
          question.id
        );
        const ids = rightAnswers.map((value) => value.id);
        console.log(ids);
        console.log(response.userOptions);
        if (arraysAreEqual(ids, response.userOptions)) {
          userScore += question.note;
        }
      }
    }
  } else {
    return next(
      new ApiError(`There is no Questions To Submit it's response `, 400)
    );
  }

  // save the user Score And the
  const userResult = new Result(req.body.quiz, req.user.id, userScore);
  try {
    await userResult.save();
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      throw new Error(`You Submit the Answer of This Quiz Before`);
    }
  }
  // get the score Total of Quiz
  const [[result]] = await Quiz.getScoreTotal(req.body.quiz);
  res.status(200).json({
    msg: `You got ${userScore}  Of ${result.score_total}`,
    userScore,
    Total: result.score_total,
  });
});

const findUserAnswerForQuestion = (responses, id) => {
  for (const res of responses) {
    if (res.questionId === id) {
      return res;
    }
  }
};
function arraysAreEqual(arr1, arr2) {
  // Check if lengths are different
  if (arr1.length !== arr2.length) return false;

  // Compare each element
  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i] !== arr2[i]) return false;
  }

  // All elements are the same
  return true;
}
const getUserResults = asyncHandler(async (req, res, next) => {
  // get the quizId
  const [results] = await Quiz.getUsersResults1(
    req.params.moduleId,
    req.user.id
  );
  res.status(200).json(results);
});

const getPassedStudents = asyncHandler(async (req, res, next) => {
  // Get the quiz ID from the request parameters
  const { quizId } = req.params;

  try {
    // Query the database to get the list of students who passed the quiz
    let passedStudents = await Result.getPassedStudents(quizId);
	passedStudents = passedStudents[0]
 

    // Create an array to store the details of passed students
    const passedStudentsDetails = [];

    // Iterate through the passedStudents array to get details of each student
    for (const student of passedStudents) {
      // Query the database to get the details of each student
      let studentDetails = await Student.findById(student.studentId);
	  studentDetails = studentDetails[0][0]

      // Push the student details along with the score to the array
      passedStudentsDetails.push({
        fullName: studentDetails.fullname,
        email: studentDetails.email,
        groupeNumber: studentDetails.groupeNumber,
        score: student.score,
      });
    }

    // Return the list of passed students
    res.status(200).json(passedStudentsDetails);
  } catch (error) {
    // Handle errors
    return next(new ApiError("Failed to retrieve passed students", 500));
  }
});

module.exports = { submitResult, getUserResults, getPassedStudents };
