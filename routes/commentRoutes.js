const express = require("express");
const router = express.Router();

const commentController = require("../controllers/commentController");
const { requireLogin } = require("../middleware/authMiddleware");

// Add comment
router.post(
    "/add",
    requireLogin,
    commentController.addComment
);

// Edit own comment
router.post(
    "/edit",
    requireLogin,
    commentController.updateComment
);

// Delete own comment or admin delete
router.post(
    "/delete",
    requireLogin,
    commentController.deleteComment
);

// Most discussed recipes
router.get(
    "/most-discussed",
    commentController.showMostDiscussed
);

module.exports = router;