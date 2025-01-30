const Product = require('../models/products');

//Listar todos os produtos
const getProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao listar produto' });
    }
};

//Adicionar um produto
const addProduct = async (req, res) => {
    try {
        const newProduct = new Product(req.body);
        const savedProduct = await newProduct.save();
        res.status(201).json(savedProduct);
    } catch (error) {
        res.status(500).json({ error: 'Error ao adicionar produto' });
    }
};

//Atualizar um produto
const updateProduct = async (req, res) => {
    const { id } = req.params;
    try { 
        const updatedProduct = await Product.findByIdAndUpdate(id, req.body, {new: true });
        if (!updatedProduct) {
            return res.status(404).json({ error: 'Produto não encontrado' });
        }
        res.json(updatedProduct);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao atualizar produto' });
    }
  };

  // Deletar um produto
const deleteProduct = async (req, res) => {
    const { id } = req.params;
    try {
      const deletedProduct = await Product.findByIdAndDelete(id);
      if (!deletedProduct) {
        return res.status(404).json({ error: 'Produto não encontrado' });
      }
      res.json(deletedProduct);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao deletar produto' });
    }
  };
  
  module.exports = { getProducts, addProduct, updateProduct, deleteProduct };