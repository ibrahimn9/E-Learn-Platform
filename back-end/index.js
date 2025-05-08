const http = require("http");
const path = require("path");
const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const globalError = require("./middlewares/errorMiddleware.js");
const pool = require("./config/database.js");
const routerAuth = require("./route/authRoute.js");
const cohortRoute = require("./route/cohortRoute");
const moduleRoute = require("./route/moduleRoute");
const classRoute = require("./route/classRoute.js");
const adminRoute = require("./route/adminRoute.js");
const userRoute = require("./route/userRoute.js");
const moocRoute = require("./route/moocRoute.js");
const teacherRoute = require("./route/teacherRoute.js");
const chapterRoute = require("./route/chapterRoute.js");
const documentRoute = require("./route/documentRoute.js");
const studentRoute = require("./route/studentRoute.js");
const resourceRoute = require("./route/resourceRoute.js");
const questionRoute = require("./route/questionRoute.js");
const resultRoute = require("./route/resultRoute");
const quizRoute = require("./route/quizRoute.js");
const submissionRoute = require("./route/submissionRoute.js");
const assignmentRoute = require("./route/assignmentRoute.js");
const ApiError = require("./utils/ApiError.js");
const cors = require("cors");
require('dotenv').config();
const PORT = process.env.PORT;
const app = express();



// Serve static files from the public directory


app.use(cors());
app.use(
  cors({
    origin: "http://localhost:5173", // Update with your client's origin
    credentials: true,
  })
);

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json({ limit: "20kb" }));
app.use(cookieParser());

//set express view engine
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
  console.log(`mode: ${process.env.NODE_ENV}`);
}

app.use("/api/v1/auth", routerAuth);
app.use("/api/v1/cohort", cohortRoute);
app.use("/api/v1/module", moduleRoute);
app.use("/api/v1/class", classRoute);
app.use("/api/v1/users", userRoute);
app.use("/api/v1/admin", adminRoute);
app.use("/api/v1/moocs", moocRoute);
app.use("/api/v1/resource", resourceRoute);
app.use("/api/v1/teacher/chapter", chapterRoute);
app.use("/api/v1/teacher/document", documentRoute);
app.use("/api/v1/teacher", teacherRoute);
app.use("/api/v1/student", studentRoute);
app.use("/api/v1/questions", questionRoute);
app.use("/api/v1/quiz", quizRoute);
app.use("/api/v1/result", resultRoute);
app.use("/api/v1/assignment", assignmentRoute);
app.use("/api/v1/submission", submissionRoute);


// For Unmounted Url
app.all("*", (req, res, next) => {
  next(new ApiError(`Can't find this route: ${req.originalUrl}`, 400));
});

// Global error handling middleware for express
app.use(globalError);

const server = http.createServer(app);
server.listen(PORT, async () => {
  try {
    await pool.execute("SELECT 1");
    console.log(`Connected To Database `);
    console.log(`Server is Listening on PORT ${PORT}`);
  } catch (error) {
    console.log(error);
  }
});

// Event => list =>callback(err)
// Handle rejection outside express
process.on("unhandledRejection", (err) => {
  console.error(`UnhandledRejection Errors: ${err.name} | ${err.message}`);
  // just in case of the current request
  server.close(() => {
    console.error(`Shutting down....`);
    process.exit(1);
  });
});
