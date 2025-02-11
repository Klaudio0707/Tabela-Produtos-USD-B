const express = require('express');
const { login, register, getAllUsers } = require('../controllers/authController');
const authenticateToken = require('../middleware/authenticateToken');

const router = express.Router();

//rota para buscar o usuário e logar
router.post('/login', login);

// Rota para registro
router.post('/register', register);

// Rota para listar todos os usuários
router.get('/users', getAllUsers, authenticateToken);

module.exports = router;