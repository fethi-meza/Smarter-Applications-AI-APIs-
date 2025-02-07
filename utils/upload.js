const path = require('path');
const multer = require('multer');
const fs = require('fs');

// Set storage engine
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = path.join(__dirname, '../public/images'); // Correct path here

        // Ensure the directory exists, if not, create it
        fs.existsSync(uploadPath) || fs.mkdirSync(uploadPath, { recursive: true });

        if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
            cb(null, uploadPath);
        } else {
            cb(new Error('Error: Images Only!'));
        }
    },
    filename: function (req, file, cb) {
        // Generate a unique filename for the image
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

// Check file type
function checkFileType(file, cb) {
    // Allowed ext
    const filetypes = /jpeg|jpg|png/;
    // Check ext
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // Check mime
    const mimetype = filetypes.test(file.mimetype);
    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb('Error: Images Only!');
    }
}

// Init upload
const upload = multer({
    storage: storage,
    limits: { fileSize: 1000000 }, // 1MB file size limit
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    }
}).single('image'); // Expecting an image field in the form

module.exports = upload;