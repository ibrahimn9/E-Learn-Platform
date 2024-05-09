const Chapter = require('../model/chapter.model.js');
const Document = require("../model/document.model.js");

const ApiError = require("../utils/ApiError.js");
const asyncHandler = require("express-async-handler");

/**-----------------------------------------------
 * @desc    insert new chapter
 * @route   /api/v1/teacher/chapter/insert-new-chapter/:moduleId
 * @method  POST
 * @access  Teacher
------------------------------------------------*/

const createChapter =asyncHandler(async (req,res,next)=>{
    const {title,description,} = req.body;
    const {moduleId} =req.params;
    const chapter = new Chapter(title,description,moduleId);
    await chapter.save();
    return res.status(201).json({message:'chapter inserted succeffully'});
});

/**-----------------------------------------------
 * @desc    get all chapters
 * @route   /api/v1/teacher/chapter/:moduleId
 * @method  GET
 * @access  Teacher
------------------------------------------------*/

const getAllChapters = asyncHandler(async(req,res,next)=>{
    const {moduleId} =req.params;
    const [chapters] = await Chapter.getAllByModuleId(moduleId);
    if(!chapters){
        return res.status(404).json({message:'chapters not found'});
    }
    for (let chapter of chapters){
        const [documents] = await Document.getAllDocumentsForChapter(chapter.id);
        chapter.documents = [...documents];
    }
    return res.status(200).json(chapters); 
})

const deleteChapter = asyncHandler(async (req,res,next)=>{
    const {chapterId} = req.params;
    await Chapter.deleteById(chapterId);
    res.status(203).json({message:'chapter deleted'});
})

module.exports = {
    createChapter,
    getAllChapters,
    deleteChapter
}