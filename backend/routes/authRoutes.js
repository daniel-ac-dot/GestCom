const express = require("express");

const router = express.Router();

const {
    login
} = require("../controllers/authController");

router.get("/prueba", (req, res) => {
    res.json({
        mensaje: "Ruta funcionando correctamente"
    });
});

router.post("/login", login);

module.exports = router;