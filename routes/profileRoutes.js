const express = require('express');
const profileController = require('../controllers/profileController');
const { requireLogin } = require('../middleware/authMiddleware');
const { uploadProfileImage } = require('../middleware/uploadMiddleware');

const router = express.Router();
router.use(requireLogin);

router.get('/', profileController.viewProfile);
router.get('/edit', profileController.showEditProfile);
router.post('/edit', profileController.updateProfile);
router.post('/image', uploadProfileImage.single('profileImage'), profileController.updateProfileImage);
router.get('/changePassword', profileController.showChangePassword);
router.post('/changePassword', profileController.changePassword);
router.get('/recipes', profileController.viewMyRecipes);
router.get('/favourites', profileController.viewMyFavourites);

module.exports = router;
