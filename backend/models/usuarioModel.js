const conexion = require("../config/db");

const buscarPorCorreo = (correo, callback) => {

    const sql =
        "SELECT * FROM usuarios WHERE correo_usuario = ?";

    conexion.query(
        sql,
        [correo],
        callback
    );
};

module.exports = {
    buscarPorCorreo
};