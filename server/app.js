require('./config/config.js');
require('./models/db');
require('./config/passportConfig');


const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
var multer = require('multer');
var xlstojson = require("xls-to-json-lc");
var xlsxtojson = require("xlsx-to-json-lc");


const rtsIndex = require('./routes/indexrouter');

var app=express();


// middleware
app.use(bodyParser.json());
app.use(cors());
app.use(passport.initialize());
app.use('/api', rtsIndex);

app.use((err, req, res, next) => {
    if (err.name === 'ValidationError') {
        var valErrors = [];
        Object.keys(err.errors).forEach(key => valErrors.push(err.errors[key].message));
        res.status(422).send(valErrors)
    }
    else{
        console.log(err);
    }
});

app.use((req, res, next) => {
    res.append('Access-Control-Allow-Origin' , 'http://localhost:3000');
    res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.append("Access-Control-Allow-Headers", "Origin, Accept,Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
    res.append('Access-Control-Allow-Credentials', true);
    next();
});

// start server
app.listen(3000, (req, res) => {
    console.log("Server started on port:3000");
});



// var storage = multer.diskStorage({ //multers disk storage settings
//     destination: function (req, file, cb) {
//         cb(null, './uploads/')
//     },
//     filename: function (req, file, cb) {
//         var datetimestamp = Date.now();
//         cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length -1])
//     }
// });

// var upload = multer({ //multer settings
//                 storage: storage,
//                 fileFilter : function(req, file, callback) { //file filter
//                     if (['xls', 'xlsx'].indexOf(file.originalname.split('.')[file.originalname.split('.').length-1]) === -1) {
//                         return callback(new Error('Wrong extension type'));
//                     }
//                     callback(null, true);
//                 }
//             }).single('file');

// /** API path that will upload the files */
// app.post('/uploadexcel', function(req, res) {
//     var exceltojson;
//     upload(req,res,function(err){
//         if(err){
//              res.json({error_code:1,err_desc:err});
//              return;
//         }
//         /** Multer gives us file info in req.file object */
//         if(!req.file){
//             res.json({error_code:1,err_desc:"No file passed"});
//             return;
//         }
//         /** Check the extension of the incoming file and 
//          *  use the appropriate module
//          */
//         if(req.file.originalname.split('.')[req.file.originalname.split('.').length-1] === 'xlsx'){
//             exceltojson = xlsxtojson;
//         } else {
//             exceltojson = xlstojson;
//         }
//         console.log(req.file.path);
//         try {
//             exceltojson({
//                 input: req.file.path,
//                 output: null, //since we don't need output.json
//                 lowerCaseHeaders:true
//             }, function(err,result){
//                 if(err) {
//                     return res.json({error_code:1,err_desc:err, data: null});
//                 }
//                 console.log(result); 
//                 res.json({error_code:0,err_desc:null, data: result});
//             });
//             var fs = require('fs');
//             try {
//                 fs.unlinkSync(req.file.path);
//             } catch(e) {
//                 //error deleting the file
//             }
//             // console.log(exceltojson);
//         } catch (e){
//             res.json({error_code:1,err_desc:"Corupted excel file"});
//         }
//     })
   
// });