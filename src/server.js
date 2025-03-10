const express = require("express");
const cors = require("cors");
require("dotenv").config();
// const cookieParser = require("cookie-parser");
// const authRoutes = require("./routes/authRoutes");
const productsRoutes = require("./routes/products");
const connectDB = require("./database/database");

connectDB();


const app = express();

//variveis de ambiente
const PORT = process.env.PORT;
const FRONT_URL = process.env.FRONT_URL;

// Middleware
app.use(
  cors({
    origin: FRONT_URL, 
    methods: ["GET", "POST", "PUT", "DELETE"], 
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true, 
  })
);

app.use(express.json());
// app.use(cookieParser());

//rotas de login, register e get users
// app.use("/auth", authRoutes);
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
