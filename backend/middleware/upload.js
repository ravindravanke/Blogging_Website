// const multer = require('multer');
// const path = require('path');

// const storage = multer.diskStorage({
//   destination: function(req, res, cb) {
//     cb(null, 'uploads/');
//   },
//   filename: function(req, file, cb) {
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//     cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
//   }
// })

// const upload = multer({ storage: storage });
// module.exports = upload;

const multer = require('multer');
const cloudinary = require('../config/cloudinary.js');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'blog_posts', 
    allowedFormats: ['jpg', 'png', 'jpeg', 'gif'],
  },
});

const upload = multer({ storage: storage });
module.exports = upload;
