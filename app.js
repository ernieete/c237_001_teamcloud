require("dotenv").config();

const express = require("express");
const session = require("express-session");
const path = require("path");
const { promisify } = require("util");

const db = require("./config/db");
const query = promisify(db.query).bind(db);

const authRoutes = require("./routes/authRoutes");
const profileRoutes = require("./routes/profileRoutes");
const recipeRoutes = require("./routes/recipeRoutes");
const favouriteRoutes = require("./routes/favouriteRoutes");
const searchRoutes = require("./routes/searchRoutes");
const ratingRoutes = require("./routes/ratingRoutes");
const commentRoutes = require("./routes/commentRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

// Creates the correct public URL for recipe images.
// Handles filenames such as:
// kimchi-fried-rice.jpg
// uploads/kimchi-fried-rice.jpg
// /uploads/kimchi-fried-rice.jpg
app.locals.getRecipeImagePath = (image) => {
    if (!image) {
        return "/images/default-recipe.png";
    }

    const cleanImage = String(image)
        .replace(/\\/g, "/")
        .replace(/^\.\//, "");

    // Allow external image URLs
    if (/^https?:\/\//i.test(cleanImage)) {
        return cleanImage;
    }

    // Already begins with a public path
    if (
        cleanImage.startsWith("/uploads/") ||
        cleanImage.startsWith("/images/")
    ) {
        return cleanImage;
    }

    // Missing only the first slash
    if (
        cleanImage.startsWith("uploads/") ||
        cleanImage.startsWith("images/")
    ) {
        return `/${cleanImage}`;
    }

    // Database contains only the filename
    return `/uploads/${cleanImage}`;
};

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

app.get("/", async (req, res) => {
    try {
        const featured = await query(`
            SELECT
                recipes.*,
                COALESCE(AVG(ratings.rating), 0) AS avg_rating,
                COUNT(DISTINCT favourites.id) AS favourites_count
            FROM recipes
            LEFT JOIN ratings ON ratings.recipe_id = recipes.id
            LEFT JOIN favourites ON favourites.recipe_id = recipes.id
            WHERE recipes.featured = 1
            GROUP BY recipes.id
            LIMIT 6
        `);

        const latest = await query(`
            SELECT
                recipes.*,
                COALESCE(AVG(ratings.rating), 0) AS avg_rating,
                COUNT(DISTINCT favourites.id) AS favourites_count
            FROM recipes
            LEFT JOIN ratings ON ratings.recipe_id = recipes.id
            LEFT JOIN favourites ON favourites.recipe_id = recipes.id
            GROUP BY recipes.id
            ORDER BY recipes.created_at DESC
            LIMIT 6
        `);

        const popular = await query(`
            SELECT
                recipes.*,
                COALESCE(AVG(ratings.rating), 0) AS avg_rating,
                COUNT(DISTINCT favourites.id) AS favourites_count
            FROM recipes
            LEFT JOIN ratings ON ratings.recipe_id = recipes.id
            LEFT JOIN favourites ON favourites.recipe_id = recipes.id
            GROUP BY recipes.id
            ORDER BY favourites_count DESC
            LIMIT 6
        `);

        res.render("home", {
            title: "Simply Homemade",
            featured,
            latest,
            popular
        });
    } catch (err) {
        console.error(err);
        res.status(500).render("error", {
            title: "Error",
            message: "Something went wrong loading recipes."
        });
    }
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