const multer = require('multer'); // Import multer
const path = require('path'); // Import path 
const crypto = require('crypto'); // Import crypto (It is used to generate a random hash for the uploaded file)



// diskstorage 
// Multer settings (It is used to accept file uploads) and save the file into the give destination by given name
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/images/blogUploads')
    },
    filename: function (req, file, cb) {
        // Generating a random hash for the uploaded file and concatinating with the file extension
        crypto.randomBytes(12, function(err, name){
           const fn = name.toString("hex")+path.extname(file.originalname);
            cb(null, fn);
        })
    }
  })
  
  const blogUploads = multer({ storage: storage })

// export upload variable
module.exports = blogUploads;