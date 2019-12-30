// let express = require('express'); 
// let app = express(); 
// let bodyParser = require('body-parser');
// let mongoose = require('mongoose');
// mongoose.connect('mongodb://127.0.0.1:27017/college');
// let conn = mongoose.connection;
// let multer = require('multer');
// let GridFsStorage = require('multer-gridfs-storage');
// let Grid = require('gridfs-stream');
// Grid.mongo = mongoose.mongo;
// let gfs = Grid(conn.db);
// let port = 3000;


const mongoose = require('mongoose');
var fun=require('./../models/db');
const passport = require('passport');
const student=mongoose.model('Student');
const teacher=mongoose.model('Teacher');
const timetable=mongoose.model('Timetable');
// const attendance=mongoose.model('Attendance');
const _ = require('lodash');
const date=require("add-subtract-date");

//add student
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
    // stu.work='student';
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

//add teacher
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
    // tea.work='teacher';
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

module.exports.timetable = (req, res, next) => {
    var time=new timetable();
    time.Day=req.body.Day;
    time.Time=req.body.Time;
    time.Subject_Name=req.body.Subject_Name;
    time.Lab=req.body.Lab;
    time.Batch=req.body.Batch;
    time.Year=req.body.Year;
    time.Division=req.body.Division;
    // start_date=new Date();
    // start_date=req.body.start_date;
    // lectures=req.body.lectures;
    
    // var i=0;
    // var j=new Date(start_date);
    // var xyz="attendance.r";
    
    // for(i=0;i<=lectures;i++)
    // {
    //     console.log(j.getDate());
    //     fun.db.collection('students').updateOne({'Year':req.body.Year,'Batch':req.body.Batch,'Division':req.body.Division}, {$push: {"attendance":[j.getDate(),"absent"]} });
    //     date.add(j,7,"days");
    // }

    time.save((err, doc) => {
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


// Route for file upload
module.exports.upload = (req, res) =>  {
    fun.upload(req,res, (err) => {
        if(err){
             res.json({error_code:1,err_desc:err});
             return;
        }
        res.json({error_code:0, error_desc: null, file_uploaded: true});
    });
}

// Downloading a single file
module.exports.download = (req, res) =>  {
    fun.gfs.collection('uploads'); //set collection name to lookup into

    /** First check if file exists */
    fun.gfs.files.find({filename: req.params.filename}).toArray(function(err, files){
        if(!files || files.length === 0){
            return res.status(404).json({
                responseCode: 1,
                responseMessage: "error"
            });
        }
        // create read stream
        var readstream = fun.gfs.createReadStream({
            filename: files[0].filename,
            root: "uploads"
        });
        // set the proper content type 
        res.set('Content-Type', files[0].contentType)
        // Return response
        return readstream.pipe(res);
    });
}

//Signup or generate password
module.exports.generate=(req,res)=>{
    console.log(req.body);
    console.log("hello routing");
    un=req.body.Id.split('');
    if(un[0]=='t')
    fun.db.collection('teachers').updateOne({'teacher_id':req.body.Id}, {$set: {'password' : req.body.Password}}, function(err, result){
        // console.log(result);
        console.log(err);
        // console.log(fun.db.collection('student').find());
    });
    // console.log(fun.db.collection('student'));
    else
    fun.db.collection('students').updateOne({'student_id':req.body.Id}, {$set: {'password' : req.body.Password}}, function(err, result){
        // console.log(result);
        console.log(err);
        // console.log(fun.db.collection('student').find());
    });
    

    return(res);
}

//authentication
module.exports.authenticate = (req, res, next) => {
    // call for passport authentication
    passport.authenticate('local', (err, user, info) => {       
        // error from passport middleware
        // console.log(user.work);
        if (err) return res.status(400).json(err);
        // registered user
        else if (user) return res.status(200).json({ "token": user.generateJwt()});
        // unknown user or wrong password
        else return res.status(404).json(info);
    })(req, res);
}

//Student login
module.exports.studentProfile = (req, res, next) =>{
    console.log('in student');
    student.findOne({ _id: req._id },
        (err, user) => {
            if (!user)
                return res.status(404).json({ status: false, message: 'User record not found.' });
            else
                // console.log(user['Year']);
                var id =user['student_id']
                var y=user['Year'];
                var d=user['Division'];
                var b=user['Batch'];
                timetable.findOne({'Year':y,'Division':d,'Batch':b},
                (err,res)=>{
                    if (!res)
                        console.log("if");
                    else
                        var date_ob = new Date();
                        var today=date_ob.getDate();
                        console.log(today);
                        // current hours
                        var hours = date_ob.getHours();
                        if (hours>12)
                        hours-=12;
                        // current minutes
                        var minutes = date_ob.getMinutes();
                        var curr=hours*60 +minutes;

                        var time =res['Time'];
                        //entry time 
                        var time1=time[0];
                        var time1e=time1.split('.').map(Number);
                        // console.log(time1e);
                        time1h=time1e[0];
                        time1m=time1e[1];
                        if (time1h>=1)
                        time1h+=12;
                        ent=(time1h*60)+time1m;
                        // console.log(time1h,time1m);
                        //exit time
                        var time2=time[1];
                        var time2e=time2.split('.').map(Number);
                        time2h=time2e[0];
                        time2m=time2e[1];
                        if (time2h>=1)
                        time2h+=12;
                        ext=(time2h*60)+time2m;
                        //calculation
                        if (curr>=ent && curr<=ext)
                            {
                                //attended
                                // fun.db.collection('attendances').updateOne({'student_id':req.body.Id}, {$set: {'Present' : true} }, function(err, result){
                                //     console.log(err);
                                // });
                                var attend=new attendance();
                                attend.Subject_Name=res['Subject_Name'];
                                attend.Day=res['Day'];
                                attend.Date=today;
                                attend.student_id=id;
                                attend.save();
                                console.log('attended');
                            }
                        else
                            {
                                //absent
                                console.log('absent');
                            }
                        console.log(ent,ext,'  ',curr,hours,minutes);
                        console.log(res);
                });
                return res.status(200).json({ status: true, user : _.pick(user,['student_id','Year','Batch','Roll_no']) });
        }
    );
}

//Teacher Login
module.exports.teacherProfile = (req, res, next) =>{
    console.log('in teacher');
    teacher.findOne({ _id: req._id },
        (err, user) => {
            if (!user)
                return res.status(404).json({ status: false, message: 'User record not found.' });
            else
                return res.status(200).json({ status: true, user : _.pick(user,['teacher_id','Year','Batch','Role']) });
        }
    );
}