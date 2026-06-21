require("./config/db");

const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");

const app = express();

app.use(cors());

app.use(express.json());

app.get("/", (req, res) => {
    res.send("Servidor GestCom funcionando");
});

app.use("/api/auth", authRoutes);

app.listen(3000, () => {
    console.log("Servidor ejecutándose en puerto 3000");
});