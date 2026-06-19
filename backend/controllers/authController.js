const Usuario = require("../models/usuarioModel");

const login = (req, res) => {

    const { correo } = req.body;

    Usuario.buscarPorCorreo(
        correo,
        (error, resultados) => {

            if(error){
                return res.status(500).json({
                    mensaje: "Error del servidor"
                });
            }

            if(resultados.length === 0){
                return res.status(404).json({
                    mensaje: "Usuario no encontrado"
                });
            }

            return res.status(200).json({
                mensaje: "Usuario encontrado",
                usuario: resultados[0]
            });

        }
    );
};

module.exports = {
    login
};