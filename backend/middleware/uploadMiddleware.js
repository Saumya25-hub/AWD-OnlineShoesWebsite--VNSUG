const multer = require('multer');
const path = require('path');

// Configure disk storage
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename(req, file, cb) {
    const ext = path.extname(file.originalname).toLowerCase();
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `shoe-${uniqueSuffix}${ext}`);
  }
});

// File filter for images
const fileFilter = (req, file, cb) => {
  const allowedExtensions = /jpg|jpeg|png|webp|svg/;
  const ext = path.extname(file.originalname).toLowerCase();
  const mime = file.mimetype;

  if (
    allowedExtensions.test(ext) &&
    (mime.startsWith('image/') || mime === 'image/svg+xml' || allowedExtensions.test(mime))
  ) {
    cb(null, true);
  } else {
    cb(new Error('Only image files (jpg, jpeg, png, webp, svg) are allowed!'), false);
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter
});

module.exports = upload;
