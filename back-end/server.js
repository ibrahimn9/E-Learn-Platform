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

app.use("/", (req, res, next) => {
	res.send("Hello World!");
});

const server = app.listen(PORT, async () => {
	try {
		const object = await pool.execute("SELECT * FROM admins");

		console.log(object);
		console.log(`Server is Listening on PORT ${PORT}`);
	} catch (error) {
		console.log(error);
	}
});

app.all("*", (req, res, next) => {
	next(new ApiError(`Can't find this route: ${req.originalUrl}`, 400));
});

// Global error handling middleware for express
app.use(globalError);

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
