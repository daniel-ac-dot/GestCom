const Usuario = require("../models/usuarioModel");
const bcrypt = require("bcrypt");

const login = (req, res) => {

    const { correo, password } = req.body;

    Usuario.buscarPorCorreo(
        correo,
        async (error, resultados) => {

            if (error) {
                return res.status(500).json({
                    mensaje: "Error del servidor"
                });
            }

            if (resultados.length === 0) {
                return res.status(404).json({
                    mensaje: "Usuario no encontrado"
                });
            }

            const coincide = await bcrypt.compare(
                password,
                resultados[0].password
            );

            if (!coincide) {
                return res.status(401).json({
                    mensaje: "Contraseña incorrecta"
                });
            }

            const usuario = {
                id: resultados[0].id,
                nombre: resultados[0].nombre,
                apellido: resultados[0].apellido,
                correo: resultados[0].correo_usuario,
                rol: resultados[0].id_rol
            };

            return res.status(200).json({
                mensaje: "Login exitoso",
                usuario
            });

        }
    );
};

module.exports = {
    login
};