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
const attendance=mongoose.model('Attendance');
const _ = require('lodash');
const date=require("add-subtract-date");
var multer = require('multer');
var xlstojson = require("xls-to-json-lc");
var xlsxtojson = require("xlsx-to-json-lc");
var XLSX = require('xlsx');

//add student
let student_register =(req, res) => {
    console.log(req);
    var i=0;
    var len=req.length;
    for (i=0;i<len;i++)
    {
        console.log(req[i].student_id);
        var stu=new student();
        stu.student_id=req[i].student_id;
        stu.Year=req[i].year;
        stu.Roll_no=req[i].roll_no;
        stu.Batch=req[i].batch;
        stu.Division=req[i].division;
        stu.Phone_no=req[i].phone_no;
        stu.Name=req[i].name;
        stu.email=req[i].email;
        stu.password=req[i].password;
        // stu.work='student';
        stu.save((err, doc) => {
            if (!err)
            {
                console.log("saving");
                // res.send(doc);
            }
            else {
                console.log("any error ",err.code);
                // if (err.code == 11000)
                //     res.status(422).send(['Duplicate email adrress found.']);
                
            }

        });
    }
}

//add teacher
let teacher_register = (req, res) => {
    console.log(req);
    var i=0;
    var len=req.length;
    for (i=0;i<len;i++)
    {
        var tea=new teacher();
        tea.teacher_id=req[i].teacher_id;
        tea.Role=req[i].role;
        tea.Year=req[i].year;
        tea.Batch=req[i].batch;
        tea.Division=req[i].division;
        tea.Phone_no=req[i].phone_no;
        tea.Name=req[i].name;
        tea.email=req[i].email;
        tea.password=req[i].password;
        tea.Subject=req[i].subject;
        // tea.work='teacher';
        tea.save((err, doc) => {
            if (!err)
                console.log("uploading");
                // res.send(doc);
            else {
                console.log("any error");
                // if (err.code == 11000)
                //     res.status(422).send(['Duplicate email adrress found.']);
                
            }

        });
    }
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

//excel upload


var storage = multer.diskStorage({ //multers disk storage settings
    destination: function (req, file, cb) {
        cb(null, './uploads/')
    },
    filename: function (req, file, cb) {
        var datetimestamp = Date.now();
        cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length -1])
    }
});

var uploade = multer({ //multer settings
                storage: storage,
                fileFilter : function(req, file, callback) { //file filter
                    if (['xls', 'xlsx'].indexOf(file.originalname.split('.')[file.originalname.split('.').length-1]) === -1) {
                        return callback(new Error('Wrong extension type'));
                    }
                    callback(null, true);
                }
            }).single('file');

module.exports.uploadexcel = (req, res) =>  {
    console.log('uploading');
    var exceltojson;
    uploade(req,res,function(err){
        if(err){
             res.json({error_code:1,err_desc:err});
             return;
        }
        /** Multer gives us file info in req.file object */
        if(!req.file){
            res.json({error_code:1,err_desc:"No file passed"});
            return;
        }
        /** Check the extension of the incoming file and 
         *  use the appropriate module
         */
        if(req.file.originalname.split('.')[req.file.originalname.split('.').length-1] === 'xlsx'){
            exceltojson = xlsxtojson;
        } else {
            exceltojson = xlstojson;
        }
        console.log(req.file.path);
        var workbook = XLSX.readFile(req.file.path);
        var sheet_name_list = workbook.SheetNames;
        console.log(sheet_name_list[0]);
        try {
            exceltojson({
                input: req.file.path,
                output: null, //since we don't need output.json
                lowerCaseHeaders:true
            }, function(err,result){
                if(err) {
                    return res.json({error_code:1,err_desc:err, data: null});
                }
                if(sheet_name_list=='students')
                    student_register(result);
                    // console.log(result); 
                else
                    teacher_register(result);

                res.json({error_code:0,err_desc:null, data: result});
            });
            var fs = require('fs');
            try {
                fs.unlinkSync(req.file.path);
            } catch(e) {
                //error deleting the file
            }
            // console.log(exceltojson);
        } catch (e){
            res.json({error_code:1,err_desc:"Corupted excel file"});
        }
    })
   
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
                        if (time1h>=1 && time1h<=6)
                        time1h+=12;
                        ent=(time1h*60)+time1m;
                        // console.log(time1h,time1m);
                        //exit time
                        var time2=time[1];
                        var time2e=time2.split('.').map(Number);
                        time2h=time2e[0];
                        time2m=time2e[1];
                        if (time2h>=1 && time2h<=6)
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
                                attend.Present=true;
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