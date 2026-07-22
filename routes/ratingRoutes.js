const express = require("express");
const router = express.Router();

const ratingController = require("../controllers/ratingController");
const { requireLogin } = require("../middleware/authMiddleware");

// Add rating
router.post(
    "/add",
    requireLogin,
    ratingController.addRating
);

// Edit own rating
router.post(
    "/edit",
    requireLogin,
    ratingController.updateRating
);

// Delete own rating
router.post(
    "/delete",
    requireLogin,
    ratingController.deleteRating
);

// Highest rated recipes
router.get(
    "/highest",
    ratingController.showHighestRated
);

module.exports = router;