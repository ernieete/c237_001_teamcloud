# 🍽 Simply Homemade

Simply Homemade is a recipe-sharing web application developed for the **C237 Software Application Development CA2**.

Users can create, edit, delete and share their own recipes with the community. Users can also favourite recipes, leave ratings and comments, while administrators can manage users, recipes and featured content.

---

## 🚀 Technologies Used

- Node.js
- Express.js
- EJS
- MySQL (Azure Database)
- Bootstrap 5
- Express Session
- bcrypt
- Multer
- dotenv

---

## 📁 Project Structure

```
c237_001_teamcloud
│
├── app.js
├── config/
├── controllers/
├── middleware/
├── routes/
├── views/
├── public/
├── database/
├── docs/
├── package.json
└── README.md
```

---

## ⚙️ Installation

Clone the repository

```bash
git clone https://github.com/ernieete/c237_001_teamcloud.git
```

Go into the project folder

```bash
cd c237_001_teamcloud
```

Install dependencies

```bash
npm install
```

Create a `.env` file using `.env.example`.

Start the server

```bash
npm start
```

Open

```
http://localhost:3000
```

---

## 👥 Team Responsibilities

| Member | Feature |
|---------|---------|
| Ernice | User Management & Profiles |
| Cecelia | Recipe Management |
| Guan Yan | Favourites |
| Oliver | Search & Discovery |
| Zhen Qi | Ratings, Reviews & Comments |
| Thihan | Admin Dashboard & Analytics |

---

## 📂 Main Features

- User Authentication
- Recipe CRUD
- Favourite Recipes
- Recipe Search & Filter
- Ratings & Reviews
- Admin Dashboard
- Featured Recipes

---

## 🗄️ Database Tables

- users
- recipes
- favourites
- ratings
- comments

---

## 📖 Team Guide

Please refer to

```
docs/team-guide.md
```

before starting development.

---

## 📌 Notes

- Do NOT commit `.env`
- Do NOT commit `node_modules`
- Create a feature branch before coding
- Push only tested code
- Submit a Pull Request before merging into `main`
