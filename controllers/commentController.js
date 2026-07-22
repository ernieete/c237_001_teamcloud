const commentModel = require("../models/commentModel");

// Add comment
exports.addComment = (req, res) => {
    const userId = req.session.user.id;
    const recipeId = req.body.recipeId;
    const comment = req.body.comment;

    if (!recipeId || !comment || comment.trim() === "") {
        return res.status(400).send("Comment cannot be empty.");
    }

    commentModel.addComment(
        userId,
        recipeId,
        comment.trim(),
        (err) => {
            if (err) {
                console.error(err);
                return res.status(500).send("Database Error");
            }

            res.redirect(`/recipes/${recipeId}`);
        }
    );
};

// Edit own comment
exports.updateComment = (req, res) => {
    const userId = req.session.user.id;
    const role = req.session.user.role;

    const commentId = req.body.commentId;
    const recipeId = req.body.recipeId;
    const newComment = req.body.comment;

    if (!newComment || newComment.trim() === "") {
        return res.status(400).send("Comment cannot be empty.");
    }

    commentModel.getCommentById(
        commentId,
        (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).send("Database Error");
            }

            if (results.length === 0) {
                return res.status(404).send("Comment not found.");
            }

            const comment = results[0];

            // Only owner can edit their own comment
            if (comment.user_id !== userId) {
                return res.status(403).send("You can only edit your own comment.");
            }

            commentModel.updateComment(
                commentId,
                newComment.trim(),
                (err) => {
                    if (err) {
                        console.error(err);
                        return res.status(500).send("Database Error");
                    }

                    res.redirect(`/recipes/${recipeId}`);
                }
            );
        }
    );
};

// Delete comment
exports.deleteComment = (req, res) => {
    const userId = req.session.user.id;
    const role = req.session.user.role;

    const commentId = req.body.commentId;
    const recipeId = req.body.recipeId;

    commentModel.getCommentById(
        commentId,
        (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).send("Database Error");
            }

            if (results.length === 0) {
                return res.status(404).send("Comment not found.");
            }

            const comment = results[0];

            // Owner or admin can delete
            if (comment.user_id !== userId && role !== "admin") {
                return res.status(403).send("Access Denied.");
            }

            commentModel.deleteComment(
                commentId,
                (err) => {
                    if (err) {
                        console.error(err);
                        return res.status(500).send("Database Error");
                    }

                    res.redirect(`/recipes/${recipeId}`);
                }
            );
        }
    );
};

// Most discussed recipes
exports.showMostDiscussed = (req, res) => {
    commentModel.getMostDiscussedRecipes(
        (err, recipes) => {
            if (err) {
                console.error(err);
                return res.status(500).send("Database Error");
            }

            res.render("community/mostDiscussed", {
                title: "Most Discussed Recipes",
                recipes
            });
        }
    );
};