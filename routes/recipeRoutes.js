const express = require("express");

const router = express.Router();

// Member 2 will add recipe routes here.
//
// Planned routes:
// GET  /recipes
router.get("/test", (req, res) => {
    res.send("Recipe routes are connected");
});

// GET  /recipes/add
// POST /recipes/add
// GET  /recipes/:id
// GET  /recipes/edit/:id
// POST /recipes/edit/:id
// POST /recipes/delete/:id

module.exports = router;