const mysql = require("mysql2");

const conection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "1234",
    database: "proyecto"
});

conection.connect((err) => {
    if (err) {
        console.error("error de conexion a MySQL:", err);
        return;
    }
    console.log("conexion exitosa a MySQL");
});

module.exports = conection;