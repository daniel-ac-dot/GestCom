const express = require("express");

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
    res.send("Servidor GestCom funcionando");
});

app.listen(3000, () => {
    console.log("Servidor ejecutándose en puerto 3000");
});