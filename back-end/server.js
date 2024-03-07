import { globalError } from "./middlewares/errorMiddleware.js";
import express from "express";
import morgan from "morgan";
import pool from "./config/database.js";
import routerAuth from "./route/authRoute.js";
const PORT = process.env.PORT;

const app = express();
app.use(express.json({ limit: "20kb" }));

if (process.env.NODE_ENV === "development") {
	app.use(morgan("dev"));
	console.log(`mode: ${process.env.NODE_ENV}`);
}
app.use("/api/v1/auth", routerAuth);

// For Unmounted Url 
app.all("*", (req, res, next) => {
	next(new ApiError(`Can't find this route: ${req.originalUrl}`, 400));
});

// Global error handling middleware for express
app.use(globalError);

const server = app.listen(PORT, async () => {
	try {
		const connection = await pool.execute("SELECT 1");
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
