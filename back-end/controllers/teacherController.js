const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/ApiError");
const Module = require("../model/module.model");
const Chapter = require("../model/chapter.model");
const Document = require("../model/document.model");



/**-----------------------------------------------
 * @desc    get all modules of teacher
 * @route   /api/v1/teacher/:teacherId
 * @method  GET
 * @access  Teacher
------------------------------------------------*/

const getModulesOfTeacher = asyncHandler(async (req,res,next)=>{
    const [modules] =await Module.getModulesOfTeacher(req.params.teacherId);
    if(!modules){
          return res.status(404).json({message:'modules not found'});
      }
      for(let module of modules){
          const [chapters] = await Chapter.getAllByModuleId(module.id);
          for(let chapter of chapters ){
              const [documents] = await Document.getAllDocumentsForChapter(chapter.id);
              chapter.documents = [...documents];
          }
          module.chapters =[...chapters];
      }
      return res.status(200).json(modules);
  })

module.exports ={
    getModulesOfTeacher
}