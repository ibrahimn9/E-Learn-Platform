const express = require("express");
const authServices = require("../controllers/authController");
const {addNewDocument, deleteDocument} = require("../controllers/documentController");
const {documentValidator} =  require("../utils/validator/documentValidator");
const router = express.Router();
const { upload } = require("../middlewares/multer");

// /api/v1/teacher/document/insert-new-document/:chapterId
router.post('/insert-new-document/:chapterId',upload.single("file"),documentValidator,addNewDocument);
// /api/v1/teacher/document/:documentId
router.delete('/:documentId',deleteDocument);


module.exports = router;