# 👨‍💻 Simply Homemade Team Guide

Please read this before you start coding.

---

# 🌿 Git Workflow

## Before coding

Always pull the latest version.

```bash
git pull origin main
```

Create your own branch.

```bash
git checkout -b feature/your-feature-name
```

Examples

```
feature/user-management
feature/recipe-management
feature/favourites
feature/search
feature/community
feature/admin
```

---

## After finishing

```bash
git add .
git commit -m "Complete recipe CRUD"
git push origin feature/recipe-management
```

Then create a Pull Request on GitHub.

❌ Do NOT push directly to main.

---

# 📂 Folder Responsibilities

## app.js

Contains

- Express setup
- Sessions
- Middleware
- Route imports
- Server startup

Do not place SQL queries here.

---

## config/

Database configuration.

Only edit if everyone agrees.

---

## controllers/

Contains application logic.

Example

```
Create Recipe

↓

Insert into database

↓

Redirect user
```

---

## routes/

Contains routes only.

Example

```javascript
router.get("/recipes", recipeController.getRecipes);
```

No SQL should be inside route files.

---

## views/

Contains EJS pages.

Keep the design consistent.

Use partials whenever possible.

---

## public/

Contains

- CSS
- Images
- Client JavaScript
- Uploaded images

---

# 🗄️ Database Naming Convention

Use snake_case.

Correct

```
user_id
recipe_id
profile_image
created_at
updated_at
```

Do NOT mix

```
profileImage
createdAt
```

---

# 👤 Session Object

Everyone should use the same session.

```javascript
req.session.user = {
    id,
    username,
    role,
    profile_image
};
```

Never invent your own session variables.

---

# 🏷️ User Roles

Only use

```
user
admin
```

No other values.

---

# 📷 Image Upload Fields

Recipe image

```
image
```

Profile picture

```
profileImage
```

---

# 📌 Route Naming

Examples

```
GET /recipes

GET /recipes/add

POST /recipes/add

GET /recipes/edit/:id

POST /recipes/edit/:id

POST /recipes/delete/:id
```

Keep route names consistent.

---

# 🎨 CSS Rules

Everyone should edit

```
public/css/style.css
```

Do not create

```
style2.css
main.css
recipe.css
```

unless the whole team agrees.

---

# 💾 Database Rules

Nobody should rename

- tables
- column names
- foreign keys

without informing the group.

---

# ✅ Before Pushing

- Test your feature
- Make sure no errors appear
- Pull latest main
- Resolve conflicts
- Push your branch
- Create Pull Request

---

Happy coding! 🍽
