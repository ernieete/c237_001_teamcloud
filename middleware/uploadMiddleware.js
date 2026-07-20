const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadDirectory = path.join(__dirname, '..', 'public', 'uploads', 'profiles');
fs.mkdirSync(uploadDirectory, { recursive: true });

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDirectory),
    filename: (req, file, cb) => {
        const extension = path.extname(file.originalname).toLowerCase();
        const safeName = `profile-${req.session.user.id}-${Date.now()}${extension}`;
        cb(null, safeName);
    }
});

const allowedTypes = new Set(['image/jpeg', 'image/png', 'image/webp']);

const uploadProfileImage = multer({
    storage,
    limits: { fileSize: 2 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        if (!allowedTypes.has(file.mimetype)) {
            return cb(new Error('Only JPG, PNG and WEBP images are allowed.'));
        }
        cb(null, true);
    }
});

module.exports = { uploadProfileImage };
