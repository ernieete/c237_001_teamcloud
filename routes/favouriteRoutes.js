const express = require("express");

const router = express.Router();


const favouriteController = require('../controllers/favouriteController');

const { isAuthenticated } = require('../middleware/auth');


router.get(
    '/favourites',
    isAuthenticated,
    favouriteController.viewFavourites
);


router.post(
    '/favourite/add/:id',
    isAuthenticated,
    favouriteController.addFavourite
);


router.post(
    '/favourite/remove/:id',
    isAuthenticated,
    favouriteController.removeFavourite
);


router.get(
    '/api/favourites/count',
    isAuthenticated,
    favouriteController.getFavouriteCount
);

router.get(
    "/favourites/statistics",
    isAuthenticated,
    favouriteController.viewStatistics
);

module.exports = router;

module.exports = router;