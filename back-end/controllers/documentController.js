const ApiError = require("../utils/ApiError.js");
const asyncHandler = require("express-async-handler");
const Document = require('../model/document.model.js');
const {uploadFile,deleteFile} = require('../utils/documentCloud.js');
const fs = require('fs');

/**-----------------------------------------------
 * @desc    insert new document
 * @route   /api/v1/teacher/document/insert-new-document/:chapterId
 * @method  POST
 * @access  Teacher
------------------------------------------------*/

const addNewDocument = asyncHandler(async (req,res,next)=>{
    const file = req.file;
    const {chapterId} = req.params;
    const {title,description,type} = req.body;
    const response = await uploadFile(file);
    const document = new Document(title,description,type,response.id,chapterId);
    await document.save();
    await fs.unlinkSync(file.path);
    return res.status(201).json({message:'document inserted succefully'});
});

/**-----------------------------------------------
 * @desc    delete document
 * @route   /api/v1/teacher/document/:documentId
 * @method  DELETE
 * @access  Teacher
------------------------------------------------*/
const deleteDocument = asyncHandler(async (req,res,next) => {
    const {documentId} = req.params;
    const {link} = req.body;
    await deleteFile(link);
    // await Document.deleteById(documentId);
    res.status(203).json({message:"document deleted"});

})

module.exports ={
    addNewDocument,
    deleteDocument
}