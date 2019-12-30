// let express = require('express'); 
// let app = express(); 
// let bodyParser = require('body-parser');
let mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/college');
let conn = mongoose.connection;
let db=conn.db;
let multer = require('multer');
let GridFsStorage = require('multer-gridfs-storage');
let Grid = require('gridfs-stream');
Grid.mongo = mongoose.mongo;
let gfs = Grid(conn.db);
// let port = 3000;

// global.gfs;
// let a;
// let connection = mongoose.connection;
// connection.on('error', console.error.bind(console, 'connection error:'));
// connection.once('open', function() {
//     console.log("Connected!")
//     let mongoDriver = mongoose.mongo;
//     global.gfs = Grid(connection.db, mongoDriver);
// });


let storage = GridFsStorage({
    gfs : gfs,
    url:"mongodb://127.0.0.1:27017/college",
    file: (req, file) => {
        return new Promise((resolve, reject) => {
            const filename = file.originalname;
            const fileInfo = {
              filename: filename,
              bucketName: 'uploads'
            };
            // let date = Date.now();
            // cb(null, file.fieldname + '-' + date + '.'); 
            resolve(fileInfo);
        });
      },
    // filename: (req, file, cb) => {
    //     let date = Date.now();
    //     // The way you want to store your file in database
    //     cb(null, file.fieldname + '-' + date + '.'); 
    //     // GridFS(db,"dat");
    // },
    // bucketName:'dat',
    // Additional Meta-data that you want to store
    // metadata: function(req, file, cb) {
    //     cb(null, { originalname: file.originalname });
    // },
    
     root: 'uploads' // Root collection name
});

// Multer configuration for single file uploads
let upload = multer({
    storage: storage
}).single('file');

require('./usermodel');
exports.storage=storage;
exports.gfs=gfs;
exports.upload=upload;
exports.db=db;
// require('./../controller/usercontroller');