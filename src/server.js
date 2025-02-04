const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

// Importando as rotas de produtos
const productsRoutes = require('./routes/products');

const app = express();
const PORT = process.env.PORT;
const FRONT_URL = process.env.FRONT_URL;
const DESENVOLVIMENTO_URL = process.env.DESENVOLVIMENTO_URL;

// Middleware
app.use(cors({
    origin: FRONT_URL || DESENVOLVIMENTO_URL, // Aceitando qualquer requisição
    methods: ["GET", "POST", "PUT", "DELETE"], // Métodos permitidos
    allowedHeaders: ["Content-Type", "Authorization"], // Cabeçalhos permitidos
  })
);


app.use(express.json());

// Conectar ao MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ Conectado ao MongoDB'))
    .catch((error) => console.error('❌ Erro ao conectar ao MongoDB:', error));

// Rotas de produtos
app.use('/products', productsRoutes);

// Middleware de erros globais
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Ocorreu um erro no servidor' });
});

// Iniciar o servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
    console.log(`🌐 Frontend permitido: ${FRONT_URL}`);
});