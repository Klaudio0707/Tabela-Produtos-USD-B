const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

// Importando as rotas de produtos
const productsRoutes = require('./routes/products');

const app = express();
const PORT = process.env.PORT || 1000;
const FRONT_URL = process.env.FRONT_URL;

// Middleware
app.use(cors({
    origin: FRONT_URL || "*", // Substitua pela URL do frontend
    methods: ["GET", "POST", "PUT", "DELETE"], // Métodos permitidos
    allowedHeaders: ["Content-Type", "Authorization"], // Cabeçalhos permitidos
  })
);


app.use(express.json());

// Conectar ao MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Conectado ao MongoDB'))
    .catch((error) => console.error('Erro ao conectar ao MongoDB:', error));

// Usando as rotas de produtos
app.use('/products', productsRoutes);

// Iniciar o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
