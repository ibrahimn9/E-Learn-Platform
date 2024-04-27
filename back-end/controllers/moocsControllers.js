const axios = require("axios");
const FormData = require("form-data");
const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/ApiError");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const ffmpegStatic = require("ffmpeg-static");
const ffmpeg = require("fluent-ffmpeg");
const Mooc = require("../model/mooc.model");

// Tell fluent-ffmpeg where it can find FFmpeg
ffmpeg.setFfmpegPath(ffmpegStatic);

const videoFilter = (req, file, cb) => {
	// Accept video files only
	if (!file.originalname.match(/\.(mp4|MP4|avi|mkv)$/)) {
		return cb(new Error("Only video files are allowed!"), false);
	}
	cb(null, true);
};

const upload = multer({
	fileFilter: videoFilter,
	storage: multer.memoryStorage(),
}).single("mooc");

const uploadMooc = asyncHandler(async (req, res, next) => {
	upload(req, res, async function (err) {
		try {
			if (err) {
				next(
					new ApiError(
						"Error uploading document. Make sure it is a video file.",
						403
					)
				);
			} else {
				const { videoTitle, videoDescription } = req.body;
				const inputBuffer = req.file.buffer;
				//save buffer to file
				const inputFileExtension = path.extname(req.file.originalname);
				const inputFile = `input-${uuidv4()}-${Date.now()}-${inputFileExtension}`;
				fs.writeFileSync(inputFile, inputBuffer);
				// 1- generate thumbnail image
				imageInput = `${inputFile}.png`;

				ffmpeg(inputFile)
					.screenshots({
						timestamps: ["10%"],
						folder: "./public/img",
						filename: imageInput,
						size: "720x?",
					})
					.on("error", function (err) {
						console.error(`this ${err}`);
					});

				// 2- compress video
				ffmpeg(inputFile)
					.output(req.file.originalname)
					.videoCodec("libx264")
					.audioCodec("libmp3lame")
					.size("720x?")
					.on("error", (err) => {
						console.log("Error:", err.message);
					})
					.on("end", async function () {
						const imageFilePath = `./public/img/${imageInput}`;
						const response = await uploadVideoToUpStreamApi(
							process.env.UPSTREAM_API_KEY,
							inputFile,
							videoTitle,
							videoDescription,
							imageFilePath,
							req.file.originalname
						);
						if (!response) {
							return next(
								new ApiError("There is Error When Uploading File", 500)
							);
						}
						fs.unlinkSync(imageFilePath);
						fs.unlinkSync(inputFile);
						fs.unlinkSync(req.file.originalname);
						const mooc = new Mooc(
							videoTitle,
							videoDescription,
							`https://upstream.to/embed-${response.files[0].filecode}.html`,
							req.body.idModule
						);
						mooc.save();
						res.json({
							msg: "Files uploaded successfully.",
							data: response,
						});
					})
					.run();
			}
		} catch (error) {
			console.log(error);
			res.status(500).send({
				message: "Something went wrong while uploading...",
			});
		}
	});
});

async function uploadVideoToUpStreamApi(
	apiKey,
	videoFile,
	videoTitle,
	videoDescription,
	videoThumbnail,
	fileName
) {
	//  Create FormData
	const formData = new FormData();
	formData.append("key", apiKey);
	formData.append("file", fs.createReadStream(videoFile),fileName);
	formData.append("file_title", videoTitle);
	formData.append("file_descr", videoDescription);
	formData.append("snapshot", fs.createReadStream(videoThumbnail), "image.png");
	formData.append("fld_id", process.env.E_LEARN_FOLDER_ID);
	// 3- make apiCall
	try {
		const response = await axios.post(process.env.UPSTREAM_URL, formData, {
			headers: formData.getHeaders(),
		});
		return response.data;
	} catch (error) {
		return error.message;
	}
}

const getAllMooc = asyncHandler(async (req, res, next) => {
	const { title, description } = req.query;
	const [result] = await Mooc.fetchAll(title, description);
	if (!result) {
		return next(new ApiError("there is no Mooc", 404));
	}
	res.status(200).json({ data: result });
});

const getMoocByModule = asyncHandler(async (req, res, next) => {
	const [result] = await Mooc.fetchByModuleId(req.params.idModule);
	if (!result) {
		return next(new ApiError("there is no Mooc", 404));
	}
	res.status(200).json({ data: result });
})

const getMoocById = asyncHandler(async (req, res, next) => {
	const { moocId } = req.params;
	const [[result]] = await Mooc.findById(moocId);
	if (!result) {
		return next(new ApiError(`There is no result for this request`, 400));
	}
	res.status(200).json({ data: result });
});
const updateMooc = asyncHandler(async (req, res, next) => {
	const [[document]] = await Mooc.findById(req.params.moocId);
	if (!document) {
		return next(new ApiError(`No Mooc for this id ${req.params.moocId}`, 404));
	}
	const { title, description } = req.body;
	await Mooc.updateMooc(title, description, req.params.moocId);
	res.status(200).json({ message: "Mooc Updated" });
});

const deleteMooc = asyncHandler(async (req, res, next) => {
	const [[document]] = await Mooc.findById(req.params.moocId);
	if (!document) {
		return next(new ApiError(`No mooc for this id ${req.params.moocId}`, 404));
	}
	await Mooc.deleteById(req.params.moocId);
	res.status(204).send();
});
module.exports = {
	uploadMooc,
	getMoocById,
	getAllMooc,
	updateMooc,
	deleteMooc,
	getMoocByModule,
};
