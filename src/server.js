const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();


// Importando as rotas de produtos
const productsRoutes = require('./routes/products');

const app = express();
const PORT = process.env.PORT;
const FRONT_URL = process.env.FRONT_URL;
const KEY_SESSION = process.env.KEY_SESSION;

// Middleware
app.use(cors({
    origin: FRONT_URL, // Aceitando qualquer requisição
    methods: ["GET", "POST", "PUT", "DELETE"], // Métodos permitidos
    allowedHeaders: ["Content-Type", "Authorization"], // Cabeçalhos permitidos
})

// limitar numero de requisições
);
const session = require('express-session');
app.use(session({
secret: KEY_SESSION,
resave: false,
saveUninitialized: true,
cookie: {maxAge: 6000}
}))
app.use((req, res, next) => {
if(!req.session.requestCount){
    req.session.requestCount = 0;
}
const requestLimit = 3; // limite de 3 requisições por sessão
if(req.session.requestCount >= requestLimit) {
    return res.status(429).json({error: "Limite de Requisições Atingida"})
}
req.session.requestCount++; // Incrementação 
next(); // Prossegue para a próxima rota
})

// middleware para analisar o json
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
    console.log(`🚀 Servidor rodando em http://localhost:${PORT} - Desabilitado`);
    console.log(`🌐 Frontend permitido: ${FRONT_URL}`);
});