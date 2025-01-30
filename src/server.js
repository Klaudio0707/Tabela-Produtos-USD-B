const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const productsRoutes = require('./models/products');

const app = express();
const PORT = process.env.PORT || 5002;

//Middleware
app.use(cors());
app.use(express.json());

//Conectar ao mongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Conectado ao MongoDB'))
    .catch((error) => console.error('Erro ao conectar ao MongoDB:', error));
// Rotas
app.use('/products', productsRoutes);


// Iniciar o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});