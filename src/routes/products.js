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
// Rota PUT para atualizar um produto existente
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, manufacturer, priceInside, priceOutside, currency, ipi, ipiRate } = req.body;

  //verifica se todos os dados necessários estão presentes no body, no corpo
  if (!name || !manufacturer || !priceInside || !priceOutside || !currency) {
    return res.status(400).json({ message: 'Dadps insulficientes para atualizar o produto.' });

  }
  const updates = {
    name,
    manufacturer,
    priceInside,
    priceOutside,
    currency,
    ipi,
    ipiRate,
  };
  try {
    const updatedProduct = await Product.findByIdAndUpdate(id, updates, {

      new: true,
      runValidators: true,
    });

    if (!updatedProduct) { //caso o produto não seja encontrado ou atualizado
      return res.status(404).json({ message: 'produto não encontrad' });

    }
    res.status(200).json(updatedProduct); // retorna o produto já atualizadp
  } catch (error) {
    console.error('Erro ao atualizar o produto:', error);
    res.status(500).json({ message: 'Erro ao atualizar produto' });
  }

});
// Rota DELETE para apagar um produto
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const deletedProduct = await Product.findByIdAndDelete(id); // Apaga o produto pelo ID
    if (!deletedProduct) {
      return res.status(404).json({ message: 'Produto não encontrado' });
    }
    res.status(200).json({ message: 'Produto excluído com sucesso' });
  } catch (error) {
    console.error('Erro ao excluir produto:', error);
    res.status(500).json({ message: 'Erro ao excluir produto' }); // Erro interno do servidor
  }
});

module.exports = router;

