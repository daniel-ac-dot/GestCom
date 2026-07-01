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

const crearUsuario = (usuario, callback) => {

    const sql = `
        INSERT INTO usuarios
        (
            nombre,
            apellido,
            fecha_registro,
            correo_usuario,
            password,
            estado,
            id_rol
        )
        VALUES (
            ?,
            ?,
            CURDATE(),
            ?,
            ?,
            ?,
            (SELECT id FROM roles WHERE nombre = ? LIMIT 1)
        )
    `;

    conexion.query(
        sql,
        [
            usuario.nombre,
            usuario.apellido,
            usuario.correo_usuario,
            usuario.password,
            usuario.estado,
            usuario.rol
        ],
        callback
    );

};

module.exports = {
    buscarPorCorreo,
    crearUsuario
};
