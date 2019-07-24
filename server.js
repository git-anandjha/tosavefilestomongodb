// call all the required packages
const express = require('express')
const bodyParser= require('body-parser')
const multer = require('multer');
const mongoose = require('mongoose');
const fs = require('fs');
const html = require('html');


//CREATE EXPRESS APP
const app = express();
app.use(bodyParser.urlencoded({extended: true}))

//ROUTES WILL GO HERE
app.get('/',function(req,res){
  res.sendFile(__dirname + '/index.html');

}); 

 //UPLOADING FILES TO THE "UPLOAD" FOLDER IN THE LOCAL FILE DIRECTORY
            var storage = multer.diskStorage({
              destination: function (req, file, cb) {
                cb(null, 'uploads')
              },
              filename: function (req, file, cb) {
                cb(null, file.fieldname + '-' + Date.now()+'-'+file.originalname)
              }
            })

            var upload = multer({ storage: storage })

    app.post('/uploadfile', upload.single('myFile'), (req, res, next) => {
        const file = req.file
         if (!file) {
        const error = new Error('Please upload a file')
            error.httpStatusCode = 400
            return next(error)
              }
        res.send(file)

            })

//Uploading multiple files
app.post('/uploadmultiple', upload.array('myFiles', 12), (req, res, next) => {
  const files = req.files
  if (!files) {
        const error = new Error('Please choose files')
        error.httpStatusCode = 400
        return next(error)
    }
res.send(files)
})

// USING MONGODB DATABASE AS A SERVER TO STORE THE THA DATA AND RETREVING THE DATA WHEN THE TIME COMES
mongoose.connect("mongodb://localhost/imgphoto",{ useNewUrlParser: true });


app.post('/upload/photo',upload.single('myImage'),(req,res)=>{
    var img = fs.readFileSync(req.file.path);
    var encode_image = img.toString('base64');
    // console.log(req.file);
    var finalImg = {
    name: String,
    image:new Buffer.from(encode_image,'base64')
    };

  const images=mongoose.model('image',finalImg)
  var image=new images
  // image.contentType=req.file.mimetype
  image.image=encode_image
  image.name=req.originalname
  image.save((err,res)=>{
     // console.log(err);
  })
  res.send('UpLOADED ')
  console.log(res);
})


app.listen(3000, () => {
    console.log('Server is up on port 3000.')
})
