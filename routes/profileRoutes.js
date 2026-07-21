const express = require('express');
const multer = require('multer');
const profileController = require('../controllers/profileController');
const { requireLogin } = require('../middleware/authMiddleware');
const { uploadProfileImage } = require('../middleware/uploadMiddleware');

const router = express.Router();
router.use(requireLogin);

router.get('/', profileController.viewProfile);
router.get('/edit', profileController.showEditProfile);
router.post('/edit', profileController.updateProfile);

function handleProfileUpload(req, res, next) {
    uploadProfileImage.single('profileImage')(req, res, (error) => {
        if (!error) {
            return profileController.updateProfileImage(req, res, next);
        }

        console.error('PROFILE UPLOAD ERROR:', error);

        let message = 'Unable to upload the image.';
        if (error instanceof multer.MulterError && error.code === 'LIMIT_FILE_SIZE') {
            message = 'The image must be smaller than 2 MB.';
        } else if (error.message) {
            message = error.message;
        }

        return res.redirect(`/profile?message=${encodeURIComponent(message)}`);
    });
}

router.post('/image', handleProfileUpload);
router.post('/upload-picture', handleProfileUpload);

router.get('/changePassword', profileController.showChangePassword);
router.post('/changePassword', profileController.changePassword);
router.get('/recipes', profileController.viewMyRecipes);
router.get('/favourites', profileController.viewMyFavourites);

module.exports = router;
