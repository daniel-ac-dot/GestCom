const express = require("express");

const router = express.Router();

const {
    login,
    register
} = require("../controllers/authController");

router.get("/prueba", (req, res) => {
    res.json({
        mensaje: "Ruta funcionando correctamente"
    });
});

router.post("/login", login);
router.post("/register", register);
module.exports = router;