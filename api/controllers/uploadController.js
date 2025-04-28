const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const imageDownloader = require('image-downloader');

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb('Error: Images only!');
    }
  }
});

// Handle multiple file uploads
exports.uploadPhotos = (req, res) => {
  const uploadMiddleware = upload.array('photos', 10); // max 10 photos

  uploadMiddleware(req, res, function(err) {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ message: 'Upload error: ' + err.message });
    } else if (err) {
      return res.status(400).json({ message: err });
    }

    const uploadedFiles = req.files.map(file => {
      return `/uploads/${file.filename}`;
    });

    res.json(uploadedFiles);
  });
};

// Handle upload by link
exports.uploadByLink = async (req, res) => {
  const { link } = req.body;
  if (!link) {
    return res.status(400).json({ message: 'Please provide an image URL' });
  }

  try {
    const newName = 'photo-' + Date.now() + '.jpg';
    const uploadPath = path.join(__dirname, '../uploads');
    
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    const destPath = path.join(uploadPath, newName);
    
    await imageDownloader.image({
      url: link,
      dest: destPath
    });

    res.json('/uploads/' + newName);
  } catch (error) {
    res.status(400).json({ message: 'Failed to upload image from link' });
  }
}; 