const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/ApiError");
const Module = require("../model/module.model");
const Chapter = require("../model/chapter.model");

/**-----------------------------------------------
 * @desc    get all modules of student
 * @route   /api/v1/student/:cohortId
 * @method  GET
 * @access  Student
------------------------------------------------*/

const getModulesByCohorteId = asyncHandler(async(req,res,next)=>{
    const {cohortId} = req.params;
    const [modules] = await Module.getModulesByCohorteId(cohortId);
    if(!modules){
        return res.status(404).json({message:"modules not found"});
    }
    for(let module of modules){
        const [chapters] = await Chapter.getAllByModuleId(module.id);
        module.chapters = [...chapters];
    }
    return res.status(200).json(modules);
})


/**-----------------------------------------------
 * @desc    get all modules of student
 * @route   /api/v1/student/modules/:studentId
 * @method  GET
 * @access  Student
------------------------------------------------*/
const getModulesByStudentId = async(req,res,next)=>{
    const {studentId} = req.params;
    const [modules] = await Module.getModulesByStudentId(studentId);
    console.log(studentId)
    if(!modules){
        return res.status(404).json({message:"modules not found"});
    }
    return res.status(200).json(modules);
}

module.exports ={
    getModulesByCohorteId,
    getModulesByStudentId
}