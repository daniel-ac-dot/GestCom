const mysql = require("mysql2");

const conexion = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "gestcom"
});

conexion.connect((error) => {

    if (error) {
        console.error("Error de conexión:", error);
        return;
    }

    console.log("Base de datos conectada correctamente");
});

module.exports = conexion;