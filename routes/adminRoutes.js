const express = require('express');
const adminController = require('../controllers/adminController');
const { requireAdmin } = require('../middleware/roleMiddleware');

const router = express.Router();
router.use(requireAdmin);

router.get('/', (req, res) => res.redirect('/admin/users'));
router.get('/users', adminController.listUsers);
router.get('/users/:id', adminController.viewUser);
router.post('/users/:id/delete', adminController.deleteUser);

module.exports = router;
