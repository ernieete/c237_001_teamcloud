const express = require("express");

const router = express.Router();

const favouriteController = require("../controllers/favouriteController");

const { requireLogin } = require("../middleware/authMiddleware");

router.get(
    "/favourites",
    requireLogin,
    favouriteController.viewFavourites
);

router.post(
    "/favourite/add/:id",
    requireLogin,
    favouriteController.addFavourite
);

router.post(
    "/favourite/remove/:id",
    requireLogin,
    favouriteController.removeFavourite
);

router.get(
    "/api/favourites/count",
    requireLogin,
    favouriteController.getFavouriteCount
);

module.exports = router;