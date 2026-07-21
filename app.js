require("dotenv").config();

const express = require("express");
const session = require("express-session");
const path = require("path");

require("./config/db");

const authRoutes = require("./routes/authRoutes");
const profileRoutes = require("./routes/profileRoutes");
const recipeRoutes = require("./routes/recipeRoutes");
const favouriteRoutes = require("./routes/favouriteRoutes");
const searchRoutes = require("./routes/searchRoutes");
const ratingRoutes = require("./routes/ratingRoutes");
const commentRoutes = require("./routes/commentRoutes");
const adminRoutes = require("./routes/adminRoutes");
const recipeModel = require("./models/recipeModel");

const app = express();
const PORT = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 1000 * 60 * 60 * 2
        }
    })
);

// Make the logged-in user available in every EJS page.
app.use((req, res, next) => {
    res.locals.currentUser = req.session.user || null;
    next();
});

app.get("/", (req, res) => {

    recipeModel.getAllRecipes((err, recipes) => {

        if (err) {
            console.error(err);

            return res.render("home", {
                title: "Simply Homemade",
                recipes: []
            });
        }

        res.render("home", {
            title: "Simply Homemade",
            recipes: recipes.slice(0, 3)
        });

    });

});

app.use("/", authRoutes);
app.use("/profile", profileRoutes);
app.use("/recipes", recipeRoutes);
app.use("/favourites", favouriteRoutes);
app.use("/", searchRoutes);
app.use("/ratings", ratingRoutes);
app.use("/comments", commentRoutes);
app.use("/admin", adminRoutes);

app.use((req, res) => {
    res.status(404).render("404", {
        title: "Page Not Found"
    });
});

app.use((error, req, res, next) => {
    console.error(error);

    res.status(500).render("error", {
        title: "Error",
        message: "Something went wrong."
    });
});

app.listen(PORT, () => {
    console.log(`Simply Homemade is running on http://localhost:${PORT}`);
});