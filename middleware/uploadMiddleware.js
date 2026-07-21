const multer = require("multer");
const path = require("path");
const fs = require("fs");

/* ---------- Recipe Images ---------- */

const recipeStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const uploadRecipeImage = multer({
    storage: recipeStorage
});


/* ---------- Profile Images ---------- */

const profileDirectory = path.join(
    __dirname,
    "..",
    "public",
    "uploads",
    "profiles"
);

fs.mkdirSync(profileDirectory, { recursive: true });

const profileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, profileDirectory);
    },
    filename: (req, file, cb) => {
        const extension = path.extname(file.originalname).toLowerCase();

        cb(
            null,
            `profile-${req.session.user.id}-${Date.now()}${extension}`
        );
    }
});

const uploadProfileImage = multer({
    storage: profileStorage
});


module.exports = {
    uploadRecipeImage,
    uploadProfileImage
};