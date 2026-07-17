const mysql = require("mysql2");

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: Number(process.env.DB_PORT) || 3306,
    ssl: {
        rejectUnauthorized: true
    }
});

db.connect((error) => {
    if (error) {
        console.error("Database connection failed:");
        console.error(error.message);
        return;
    }

    console.log("Connected to Azure MySQL database");
});

module.exports = db;