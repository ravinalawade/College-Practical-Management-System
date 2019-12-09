const mongoose = require('mongoose');

const student=mongoose.model('Student');
const teacher=mongoose.model('Teacher');

module.exports.student_register = (req, res, next) => {
    console.log(req.body.student_id);
    var stu=new student();
    stu.student_id=req.body.student_id;
    stu.Year=req.body.Year;
    stu.Roll_no=req.body.Roll_no;
    stu.Batch=req.body.Batch;
    stu.Division=req.body.Division;
    stu.Phone_no=req.body.Phone_no;
    stu.Name=req.body.Name;
    stu.email=req.body.email;
    stu.password=req.body.password;
    stu.save((err, doc) => {
        if (!err)
        {
            console.log("saving");
            res.send(doc);
        }
        else {
            if (err.code == 11000)
                res.status(422).send(['Duplicate email adrress found.']);
            else
                return next(err);
        }

    });
}


module.exports.teacher_register = (req, res, next) => {
    var tea=new teacher();
    tea.teacher_id=req.body.teacher_id;
    tea.Role=req.body.Role;
    tea.Year=req.body.Year;
    tea.Batch=req.body.Batch;
    tea.Division=req.body.Division;
    tea.Phone_no=req.body.Phone_no;
    tea.Name=req.body.Name;
    tea.email=req.body.email;
    tea.password=req.body.password;
    tea.Subject=req.body.Subject;
    tea.save((err, doc) => {
        if (!err)
            res.send(doc);
        else {
            if (err.code == 11000)
                res.status(422).send(['Duplicate email adrress found.']);
            else
                return next(err);
        }

    });
}