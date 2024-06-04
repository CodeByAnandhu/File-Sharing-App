const express = require("express");
const router = express.Router();
const Multerupload = require("../middleware/multer");
 
const {
  mainHome,
  home,
  upload,
  download,
  postUpload,
  postRegister,
  generatekey,
  postDownload,
  uploadedFiles,

} = require("../controller/fileController")

router.get('/', mainHome);
router.get("/home", home);
router.get('/upload', upload);
router.get('/download', download);
router.get('/generatekey', generatekey);


router.post("/login", postRegister);
router.post("/uploads", Multerupload,postUpload);
router.post("/download", Multerupload,postDownload);
router.get("/uploadedFiles", uploadedFiles);

module.exports = router
