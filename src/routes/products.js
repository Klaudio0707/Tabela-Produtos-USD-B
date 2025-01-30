const express = require('express');
const Product = require('../models/products');  // Caminho correto do seu modelo
const router = express.Router();

// Rota GET para retornar todos os produtos
router.get('/', async (req, res) => {
    try {
        const products = await Product.find();  // Busca todos os produtos no banco de dados
        if (products.length === 0) {
            return res.status(404).json({ message: 'Nenhum produto encontrado' });
        }
        res.status(200).json(products);  // Retorna a lista de produtos
    } catch (error) {
        console.error('Erro ao buscar produtos:', error);
        res.status(500).json({ message: 'Erro ao buscar produtos' });  // Erro interno do servidor
    }
});

// Rota POST para adicionar um novo produto
router.post('/', async (req, res) => {
    const { name, manufacturer, priceInside, priceOutside, currency, ipi, ipiRate } = req.body;
    try {
        const newProduct = new Product({
            name,
            manufacturer,
            priceInside,
            priceOutside,
            currency,
            ipi,
            ipiRate
        });

        await newProduct.save();  // Salva o novo produto no banco de dados
        res.status(201).json(newProduct);  // Retorna o produto recém-criado
    } catch (error) {
        console.error('Erro ao criar produto:', error);
        res.status(500).json({ message: 'Erro ao criar produto' });  // Erro interno do servidor
    }
});

module.exports = router;

