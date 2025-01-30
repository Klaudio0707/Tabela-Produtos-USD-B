// const express = require('express');
// const bodyParser = require('body-parser');
// const cors = require('cors'); // Middleware para habilitar requisições de diferentes origens
// const fs = require('fs'); // Biblioteca do Node.js para manipular arquivos

// const app = express();
// const PORT = 5002;
// const DATA_FILE = './db.json';

// app.use(cors());
// app.use(bodyParser.json());

// //leitura do arquivo json
// const readData = () => {
//     try {
//         const data = fs.readFileSync(DATA_FILE, 'utf8');
//         const parsedData = JSON.parse(data);
//         return parsedData.products || []; // Retorna o array de produtos
//     } catch (error) {
//         console.error("Erro ao ler os dados:", error.message);
//         return []; // Retorna um array vazio se houver erro
//     }
// };

// // função para escrever dados no json
// const writeData = (data) => {
//     const jsonData = { products: data };
//     fs.writeFileSync(DATA_FILE, JSON.stringify(jsonData, null, 2));
// };

// //Rota get -- listar produtos
// app.get('/products', (req, res) => {
//     const products = readData();
//     res.json(products);
// });

// //Rota post -- Adicionar produto a lista
// app.post('/products', (req, res) => {
//     const products = readData(); // ler os dados do arquivo
//     const newProduct = { id: Date.now(), ...req.body };
//     products.push(newProduct);
//     writeData(products);
//     res.status(201).json(newProduct); //retorna o produto criado
// });

// // Rota put - Atualizar produto da lista
// app.put('/products/:id', (req, res) => {
//     const { id } = req.params;
//     const products = readData();
//     const index = products.findIndex((p) => p.id === parseInt(id))

//     if (index === -1) {
//         return res.status(404).json({ error: "Produto não encontrado" });
//     }
//     products[index] = { id: parseInt(id), ...req.body };
//     writeData(products);
//     res.json(products[index]);
// });

// app.delete('/products/:id', (req, res) => {
//     const { id } = req.params;
//     const products = readData();
//     const index = products.findIndex((p) => p.id === parseInt(id));

//     if (index === -1) {
//         return res.status(404).json({ error: "produto não encontrado" });

//     }
//     const deletedProduct = products.splice(index, 1); // Remove o produto da lista
//     writeData(products); // Salva os dados atualizados no arquivo
//     res.json(deletedProduct[0]); // Retorna o produto deletado


// })

// app.listen(PORT, () => {
//     console.log(`Servidor rodando na porta ${PORT}`);

// });

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
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Conectado ao MongoDB'))
    .catch((error) => console.error('Erro ao conectar ao MongoDB:', error));

// Rotas
app.use('/products', productsRoutes);

// Iniciar o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});