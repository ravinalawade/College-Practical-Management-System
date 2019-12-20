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

module.exports.generate=(req,res)=>{
    console.log(req.body);
    console.log("hello routing");
    // console.log(fun.db.collection('student'));
    fun.db.collection('students').updateOne({'student_id':req.body.Id}, {$set: {'password' : req.body.Password}}, function(err, result){
        // console.log(result);
        console.log(err);
        // console.log(fun.db.collection('student').find());
    });
    

    return(res);
}


module.exports.authenticate = (req, res, next) => {
    // call for passport authentication
    passport.authenticate('local', (err, user, info) => {       
        // error from passport middleware
        if (err) return res.status(400).json(err);
        // registered user
        else if (user) return res.status(200).json({ "token": user.generateJwt() });
        // unknown user or wrong password
        else return res.status(404).json(info);
    })(req, res);
}
