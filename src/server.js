const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const connectDB = require("./database/database");
connectDB();

// Importando as rotas de produtos e login
const authRoutes = require("./routes/authRoutes");
const productsRoutes = require("./routes/products");

//instancia do express para criar o servidor
const app = express();

//variveis de ambiente
const PORT = process.env.PORT;
const FRONT_URL = process.env.FRONT_URL;

// Middleware
app.use(
  cors({
    origin: FRONT_URL, // Permite que o frontend em localhost:3000 faça requisições
    methods: ["GET", "POST", "PUT", "DELETE"], // Métodos permitidos de requisições
    allowedHeaders: ["Content-Type", "Authorization"], // Cabeçalhos permitidos
    credentials: true, // Permite o uso de cookies e credenciais
  })
);

app.use(express.json());
app.use(cookieParser());

//rotas de login, register e get users
app.use("/auth", authRoutes);
// Rotas de produtos
app.use("/products", productsRoutes);

// Middleware de erros globais
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Ocorreu um erro no servidor" });
});

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
  console.log(`🌐 Frontend permitido: ${FRONT_URL}`);
});
