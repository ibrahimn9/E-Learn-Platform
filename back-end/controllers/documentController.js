const ApiError = require("../utils/ApiError.js");
const asyncHandler = require("express-async-handler");
const Document = require("../model/document.model.js");
const { uploadFile } = require("../utils/documentCloud.js");
const fs = require("fs");
const db = require("../config/database");
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
  const response = await uploadFile(file);
  const document = new Document(
    title,
    description,
    type,
    response.id,
    chapterId
  );
  try {
    await document.save();
    await fs.unlinkSync(file.path);
  } catch (error) {
    return error;
  }

  return res.status(201).json({ message: "document inserted succefully" });
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
