const express = require('express');
const adminController = require('../controllers/adminController');
const { requireAdmin } = require('../middleware/roleMiddleware');

const router = express.Router();
router.use(requireAdmin);

// Dashboard + analytics
router.get('/', (req, res) => res.redirect('/admin/dashboard'));
router.get('/dashboard', adminController.showDashboard);

// User management
router.get('/users', adminController.listUsers);
router.get('/users/:id', adminController.viewUser);
router.post('/users/:id/delete', adminController.deleteUser);

// Recipe management
router.get('/recipes', adminController.showAdminRecipes);
router.post('/recipes/feature/:id', adminController.featureRecipe);
router.post('/recipes/unfeature/:id', adminController.unfeatureRecipe);
router.post('/recipes/delete/:id', adminController.deleteRecipe);

module.exports = router;