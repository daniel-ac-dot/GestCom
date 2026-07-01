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

const register = (req, res) => {

    const {
        nombre,
        apellido,
        correo_usuario,
        password
    } = req.body;

    if (!nombre || !apellido || !correo_usuario || !password) {
        return res.status(400).json({
            mensaje: "Todos los campos son obligatorios"
        });
    }

    if (!/^\S+@\S+\.\S+$/.test(correo_usuario)) {
        return res.status(400).json({
            mensaje: "El correo no tiene un formato válido"
        });
    }

    if (password.length < 8) {
        return res.status(400).json({
            mensaje: "La contraseña debe tener al menos 8 caracteres"
        });
    }

    // Verificar si el correo ya existe
    Usuario.buscarPorCorreo(
        correo_usuario,
        async (error, resultados) => {

            if (error) {
                return res.status(500).json({
                    mensaje: "Error del servidor"
                });
            }

            if (resultados.length > 0) {
                return res.status(400).json({
                    mensaje: "El correo ya está registrado"
                });
            }

            // Cifrar la contraseña
            const passwordHash = await bcrypt.hash(password, 10);

            const nuevoUsuario = {
                nombre,
                apellido,
                correo_usuario,
                password: passwordHash,
                estado: "A",
                rol: "Cliente"
            };

            Usuario.crearUsuario(
                nuevoUsuario,
                (error) => {

                    if (error) {
                        return res.status(500).json({
                            mensaje: "No fue posible registrar el usuario"
                        });
                    }

                    return res.status(201).json({
                        mensaje: "Usuario registrado correctamente"
                    });

                }
            );

        }
    );
};

module.exports = {
    login,
    register
};
