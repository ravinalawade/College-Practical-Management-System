const express = require('express');
const router = express.Router();

const ctrlUser = require('../controller/usercontroller');

router.post('/student_register', ctrlUser.student_register);
router.post('/teacher_register', ctrlUser.teacher_register);
router.post('/gen_pass', ctrlUser.generate);
router.post('/authenticate', ctrlUser.authenticate);
router.post('/upload', ctrlUser.upload);
router.get('/file/:filename', ctrlUser.download);

module.exports = router;



