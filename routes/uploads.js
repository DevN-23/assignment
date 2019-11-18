var express = require('express');
var router = express.Router();
var util = require('util');
var fs = require('fs');
var multer = require('multer');
var upload = multer({ dest: "./uploads/" });

router.get('/', function(req, res) {
    res.render('upload', { title: 'Upload File' })
});

var cpUpload = upload.fields([{ name: 'myFile', maxCount: 1 }, { name: 'gallery', maxCount: 8 }]);

router.post('/upload', cpUpload, function(req, res, next) {
    console.log('here');
    if(req.files) {
        console.log(util.inspect(req.files));
        if(req.files.myFile.size === 0) {
            return next(new Error('Hey, first would you select a file?'));
        }
        fs.exists(req.files.myFile.path, function(exists) {
            if(exists) {
                res.end('Got your file!');
            }
            else {
                res.render('upload', { title: 'Upload File', message: 'Success! File Uploaded.' });   
            }
        });
    }
});

module.exports = router;