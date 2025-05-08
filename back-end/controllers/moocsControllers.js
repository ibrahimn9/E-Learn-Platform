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
const Module = require("../model/module.model");
require('dotenv').config();

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
	//fileFilter: videoFilter,
	storage: multer.memoryStorage(),
}).single("mooc");

const uploadMooc = asyncHandler(async (req, res, next) => {
	upload(req, res, async function (err) {
		try {
			if (err) {
				return next(new ApiError("Erreur d'upload. Assurez-vous que c'est une vidéo.", 403));
			}

			const { videoTitle, videoDescription, idModule } = req.body;
			if (!videoTitle || !videoDescription || !idModule) {
				return next(new ApiError("Title, description ou idModule manquant.", 400));
			}

			// Get file buffer and extension
			const inputBuffer = req.file.buffer;
			const inputFileExtension = path.extname(req.file.originalname);
			const videoFileName = `mooc-${uuidv4()}${inputFileExtension}`;
			const videoFilePath = `./public/videos/${videoFileName}`;
			const videoUrl = `/videos/${videoFileName}`; // This is what will be saved in DB

			// Save video to public/videos
			fs.writeFileSync(videoFilePath, inputBuffer);

			// Optional: generate thumbnail
			const imageFileName = `${videoFileName}.png`;
			const imagePath = `./public/img/${imageFileName}`;

			ffmpeg(videoFilePath)
				.screenshots({
					timestamps: ["10%"],
					filename: imageFileName,
					folder: "./public/img",
					size: "720x?"
				})
				.on("error", (err) => {
					console.error("Erreur thumbnail :", err.message);
				});

			// Save to DB
			const mooc = new Mooc(
				videoTitle,
				videoDescription,
				videoUrl, // this is the local URL
				idModule
			);
			await mooc.save();

			res.status(201).json({
				message: "Vidéo enregistrée avec succès",
				videoUrl,
			});
		} catch (error) {
			return next(new ApiError("Erreur serveur : " + error.message, 500));
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
	formData.append("file", fs.createReadStream(videoFile), fileName);
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
		return error;
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
});

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
