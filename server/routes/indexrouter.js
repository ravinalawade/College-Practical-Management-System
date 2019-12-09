const express = require('express');
const router = express.Router();

const ctrlUser = require('../controller/usercontroller');

router.post('/student_register', ctrlUser.student_register);
router.post('/teacher_register', ctrlUser.teacher_register);

module.exports = router;



