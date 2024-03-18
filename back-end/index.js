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
const adminRoute = require('./route/adminRoute.js');
const userRoute = require("./route/userRoute.js");
const ApiError = require("./utils/ApiError.js");
const cors = require("cors");
const Admin = require("./model/admin.model.js");
const PORT = process.env.PORT;
const app = express();


// Serve static files from the public directory
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json({ limit: "20kb" }));
app.use(cookieParser());
app.use(cors());
//set express view engine
if (process.env.NODE_ENV === "development") {
	app.use(morgan("dev"));
	console.log(`mode: ${process.env.NODE_ENV}`);
}

// app.use('/',async(req,res,next)=>{
//     const admin = new Admin("kadriayyoub","kadriayoub122@gmail.com","ayoub2003");
// 	await admin.save();
// 	return res.json("created")
// })


app.use("/api/v1/auth", routerAuth);
app.use("/api/v1/cohort", cohortRoute);
app.use("/api/v1/module", moduleRoute);
app.use("/api/v1/class", classRoute);
app.use("/api/v1/users", userRoute);
app.use('/api/v1/admin',adminRoute);

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
