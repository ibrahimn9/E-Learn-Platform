const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/ApiError.js");
const Resource = require("../model/resource.model.js");

const createResource = asyncHandler(async (req, res, next) => {
	const { description, type, link, idModule } = req.body;
	try {
		const resource = new Resource(description, type, link, idModule);
		await resource.save();
	} catch (err) {
		if (err.code === "ER_DUP_ENTRY") {
			// Handle duplicate entry error
			return next(
				new ApiError(
					"Duplicate entry error: The combination of name and resource already exists In class",
					400
				)
			);
		} else {
			throw new Error("Database error: Failed to insert the record.");
		}
	}

	res.status(201).json({ message: "Resource Added" });
});

const getResourceById = asyncHandler(async (req, res, next) => {
	const [[data]] = await Resource.findById(req.params.resourceId);
	if (!data) {
		return next(new ApiError("There is no Data", 404));
	}
	res.status(200).json({ data });
});

const getAllResources = asyncHandler(async (req, res, next) => {
	const { description, type } = req.query;
  const [data] = await Resource.fetchAll(description, type);
  if (!data) {
	return next(new ApiError("There is no Data", 404));
	}
	res.status(200).json({ data });
});

const updateResource = asyncHandler(async (req, res, next) => {
	const { description,link } = req.body;
	await Resource.updateResource(description,link, req.params.resourceId);
	res.status(200).json({ message: "resource Updated" });
});

const deleteResource = asyncHandler(async (req, res, next) => {
	const [[document]] = await Resource.findById(req.params.resourceId);
	if (!document) {
		return next(
			new ApiError(`No resource for this id ${req.params.resourceId}`, 404)
		);
	}
	await Resource.deleteById(req.params.resourceId);
	res.status(204).send();
});

module.exports = {
	deleteResource,
	getAllResources,
	getResourceById,
	updateResource,
	createResource,
};
