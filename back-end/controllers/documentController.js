const ApiError = require("../utils/ApiError.js");
const asyncHandler = require("express-async-handler");
const Document = require("../model/document.model.js");
const { uploadFile } = require("../utils/documentCloud.js");
const fs = require("fs");
const db = require("../config/database");
const path = require("path"); 
/**-----------------------------------------------
 * @desc    insert new document
 * @route   /api/v1/teacher/document/insert-new-document/:chapterId
 * @method  POST
 * @access  Teacher
------------------------------------------------*/

const addNewDocument = asyncHandler(async (req, res, next) => {
  const file = req.file;
  const { chapterId } = req.params;
  const { title, description, type } = req.body;

  // Ensure file is provided
  if (!file) {
    return next(new ApiError("No file provided", 400));
  }

  // Generate a new file name to avoid name conflicts
  const fileName = `${Date.now()}-${file.originalname}`;
  
  // Define the file path where the file will be saved
  const filePath = path.join(__dirname, "../public/uploads", fileName);

  // Move the file from temporary location to uploads folder
  fs.renameSync(file.path, filePath);

  // Save the document with the local file path
  const document = new Document(
    title,
    description,
    type,
    `/uploads/${fileName}`,  // Save relative file path in database
    chapterId
  );

  try {
    await document.save();
    return res.status(201).json({ message: "Document inserted successfully" });
  } catch (error) {
    // Cleanup if error occurs
    fs.unlinkSync(filePath);
    return next(new ApiError("Failed to insert document", 500));
  }
});


const deleteDocument = asyncHandler(async (req, res, next) => {
  const { documentId } = req.params;
  const { link } = req.body;
  //await deleteFile(link);
  await Document.deleteById(documentId);
  res.status(203).json({ message: "document deleted" });
});


const getCount = asyncHandler(async (req, res, next) => {
  try {
    const [[documentsCount]] = await db.query("SELECT COUNT(*) as count FROM documents");
    const [[resourcesCount]] = await db.query("SELECT COUNT(*) as count FROM resources");

    res.status(200).json({
      documentsCount: documentsCount.count,
      resourcesCount: resourcesCount.count,
    });
  } catch (error) {
    next(new ApiError("Failed to retrieve counts", 500));
  }
});

module.exports = {
  addNewDocument,
  deleteDocument,
  getCount
};
