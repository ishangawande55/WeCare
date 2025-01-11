// utils/fileUpload.js
const multer = require('multer');
const path = require('path');

// Set up multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Directory where files will be stored
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // File name with timestamp
  },
});

// File filter to allow only certain file types
const fileFilter = (req, file, cb) => {
  const fileTypes = /jpg|jpeg|png|gif|pdf/;
  const mimeType = fileTypes.test(file.mimetype);

  if (mimeType) {
    cb(null, true);
  } else {
    cb(new Error('Only image and pdf files are allowed'), false);
  }
};

// Initialize multer with storage and file filter
const upload = multer({
  storage,
  fileFilter,
});

module.exports = upload;