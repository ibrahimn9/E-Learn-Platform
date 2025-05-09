const express = require("express");
const authServices = require("../controllers/authController");
const {createChapter,getAllChapters, deleteChapter} = require("../controllers/chapterController");
const {chapterValidator} =  require("../utils/validator/chapterValidator");
const router = express.Router();


// /api/v1/teacher/chapter/insert-new-chapter/:moduleId
router.post('/insert-new-chapter/:moduleId',chapterValidator,createChapter);
// /api/v1/teacher/chapter/:chapterId
router.get('/:moduleId',getAllChapters);
router.delete("/:chapterId", deleteChapter)

module.exports = router;