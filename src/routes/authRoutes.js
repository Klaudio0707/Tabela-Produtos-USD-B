const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const {
  login,
  register,
  getAllUsers,
} = require("../controllers/authController");
const authenticateToken = require("../middleware/authenticateToken");

const router = express.Router();

//rota para buscar o usuário e logar
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res
        .status(401)
        .json({ message: "Senha ou Usuário Incorreto" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: " Senha ou Usuário Incorreto" });
    }
    // Gerar o token JWT
    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    res.cookie("authToken", token, {
      httpOnly: true,  // Impede acesso do JavaScript ao cookie
      secure: process.env.NODE_ENV === "production", // Só usa em HTTPS em produção
      maxAge: 24 * 60 * 60 * 1000, // Tempo de expiração do cookie (1 dia)
    });


    res.status(200).json({ token });
  } catch (error) {
    console.error("Erro no login:", error);
    res.status(500).json({ message: "Erro no servidor" });
  }
});
router.post("/logout", (req, res) => {
  res.clearCookie("authToken");
  res.status(200).json({ message: "Logout bem-sucedido!" });
});

// Rota para registro
router.post("/register", async (req, res) => {
  const { username, password, email, empresa, permiss} = req.body;

  try {
    // Validação de campos obrigatórios
    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Nome de usuário e senha são obrigatórios." });
    }

    // Validação de comprimento mínimo da senha
    if (password.length < 8) {      return res
        .status(400)
        .json({ message: "A senha deve ter pelo menos 8 caracteres." });
    }

    // Verificar se o usuário já existe
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Nome de usuário já está em uso." });
    }

    // Gerar hash da senha para maior segurança
    const hashedPassword = await bcrypt.hash(password, 10);

    // Criar e salvar o novo usuário
    const newUser = new User({ username, email, empresa, permiss, password:  hashedPassword });
    await newUser.save();

    // Retornar mensagem de sucesso
    res.status(201).json({ message: "Usuário registrado com sucesso!" });
  } catch (error) {
    console.error("Erro ao registrar usuário:", error);
    res
      .status(500)
      .json({
        message: "Erro no servidor. Não foi possível registrar o usuário.",
        error: error.message,
      });
  }
});

// Rota para listar todos os usuários
router.get("/users", getAllUsers, authenticateToken);

// Middleware para verificar o token
router.get('/verify-token', (req, res) => {
  const token = req.cookies.authToken; // Obtém o token do cookie

  if (!token) {
    return res.status(401).json({ isValid: false }); // Token não encontrado
  }

  jwt.verify(token, process.env.JWT_SECRET, (err) => {
    if (err) {
      return res.status(403).json({ isValid: false }); // Token inválido ou expirado
    }
    res.status(200).json({ isValid: true }); // Token válido
  });
});



module.exports = router;
