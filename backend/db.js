import mysql from "mysql2";

const db = mysql.createConnection({
    host: "localhost",
    user: "backend_user",   // use dedicated user
    password: "Backend@123",
    database: "transport_db"
});//
//
db.connect(err => {
    if (err) {
        console.error("Database connection failed:", err.message);
    } else {
        console.log("Database Connected");
    }//
});

export default db;//