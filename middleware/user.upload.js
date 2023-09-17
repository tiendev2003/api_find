var moment = require("moment"); // require
const formattedDate = moment().format("D_M_YYYY_hh_mm_ss");

const multer = require("multer");
const Path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log(file);
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    console.log(file);
    cb(null, formattedDate + "-" + file.originalname);
  },
});

let upload = multer({
  storage: storage,

  fileSize: 1048576,
});

module.exports = upload.single("userImage");
