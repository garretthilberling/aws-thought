const express = require("express");
const router = express.Router();
const multer = require("multer");
const AWS = require("aws-sdk");
const paramsConfig = require("../utils/params-config");

const storage = multer.memoryStorage({
  destination: function (req, file, callback) {
    callback(null, "");
  },
});

// using multer to handle image-to-URL conversion
const upload = multer({ storage }).single("image"); // the image is the key

const s3 = new AWS.S3({
  apiVersion: "2006-03-01",
});

// upload image route
router.post("/image-upload", upload, (req, res) => {
  console.log("post('/api/image-upload'", req.file);
  const params = paramsConfig(req.file);
  // image will be stored in S3 bucket
  s3.upload(params, (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send(err);
    }
    res.json(data);
  });
});

module.exports = router;
