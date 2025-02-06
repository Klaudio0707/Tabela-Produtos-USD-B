const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();


// Importando as rotas de produtos
const productsRoutes = require("./routes/products");

const app = express();
const PORT = process.env.PORT;
const FRONT_URL = process.env.FRONT_URL;


// Middleware
app.use(
    cors({
        origin: FRONT_URL, // Aceitando Só o frontend
        methods: ["GET", "POST", "PUT", "DELETE"], // Métodos permitidos
        allowedHeaders: ["Content-Type", "Authorization"], // Cabeçalhos permitidos
        preflightContinue: true,
    })
);


// middleware para analisar o json

app.use(express.json());

// Conectar ao MongoDB
mongoose
    .connect(process.env.MONGO_URI, {
    useNewUrlParser:true,
    useUnifiedTopology: true,
    maxPoolSize: 10, // quantida de conexções no pool
})
    .then(() => console.log("✅ Conectado ao MongoDB"))
    .catch((error) => console.error("❌ Erro ao conectar ao MongoDB:", error));

// Rotas de produtos
app.use("/products", productsRoutes);

// Middleware de erros globais
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: "Ocorreu um erro no servidor" });
});

// Iniciar o servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORT} - Desabilitado`);
    console.log(`🌐 Frontend permitido: ${FRONT_URL}`);
});

