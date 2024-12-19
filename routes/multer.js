const multer = require('multer')
const { v4: uuidv4 } = require('uuid')
const path = require('path')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        console.log("called dest");
        const uniquename = uuidv4()
      cb(null, './public/images/add/uploads')
    },
    filename: function (req, file, cb) {
        console.log("dest");
      const uniquename = uuidv4();
      cb(null, uniquename+path.extname(file.originalname))
    }
  })
  
  const upload = multer({ storage: storage })

  module.exports = upload;
  