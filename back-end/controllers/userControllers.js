const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/ApiError");
const cohort = require("../model/cohort.model");
const Teacher = require("../model/teacher.model");
const Student = require("../model/student.model");
const { response } = require("express");

/**-----------------------------------------------
 * @desc    get USER ALL
 * @route   /api/v1/users?name ,email= ,role=  
 * @method  GET
 * @access  Admin
------------------------------------------------*/
const getUserAll = asyncHandler(async (req, res, next) => {
  let users;
  const role = req.query.role;
  const { name, email } = req.query;
  if (role === "student") {
    [users] = await Student.findByNameOrEmail(name, email, req.user.id);
  }
  // Search for teacher
  else if (role === "teacher") {
    [users] = await Teacher.findByNameOrEmail(name, email, req.user.id);
    for (let i = 0; i < users.length; i++) {
      const user = users[i];
      const modules = await Teacher.getTeacherWithModules(user.id);
      user.modules = modules;
    }
  } else {
    const [usersStudent] = await Student.findByNameOrEmail(
      name,
      email,
      req.user.id
    );
    usersStudent.map((value) => {
      value["role"] = "student";
    });
    const [usersTeacher] = await Teacher.findByNameOrEmail(
      name,
      email,
      req.user.id
    );
    usersTeacher.map((value) => {
      value["role"] = "teacher	";
    });
    users = [...usersStudent, ...usersTeacher];
  }

  // Fetching modules for each teacher and updating the users array

  if (![users][0].length)
    return next(new ApiError(`No User Found With This Email Or name`, 400));

  res.status(200).json({ data: users });
});

/**-----------------------------------------------
 * @desc    get user By Id
 * @route   /api/v1/users/:userId? role= 
 * @method  GET
 * @access  Admin
------------------------------------------------*/

const getUserById = asyncHandler(async (req, res, next) => {
  let role = req.query.role;
  if (!role) {
    return next(new ApiError(`must specified Role`, 400));
  }
  let user;
  if (role === "student") {
    [[user]] = await Student.findByIdWithinAdmin(
      req.params.userId,
      req.user.id
    );
  }
  // Search for teacher
  else {
    [[user]] = await Teacher.findByIdWithinAdmin(
      req.params.userId,
      req.user.id
    );
  }
  if (!user)
    return next(new ApiError(`No User Found With This Email Or name`, 400));
  res.status(200).json({ data: user, role });
});

module.exports = { getUserAll, getUserById };
