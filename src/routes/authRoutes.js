const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const authenticateToken = require("../middleware/authenticateToken");
const router = express.Router();

// Rota para login
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: "Senha ou Usuário Incorreto" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Senha ou Usuário Incorreto" });
    }
    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    res.cookie("authToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.status(200).json({ token });
  } catch (error) {
    console.error("Erro no login:", error);
    res.status(500).json({ message: "Erro no servidor" });
  }
});

// Rota para logout
router.post("/logout", (req, res) => {
  res.clearCookie("authToken");
  res.status(200).json({ message: "Logout bem-sucedido!" });
});

// Rota para registro
router.post("/register", async (req, res) => {
  const { username, password, email, cnpj, companyName, permiss, isActive } = req.body;
  try {
    if (!username || !password || !email || !cnpj) {
      return res.status(400).json({
        message: "Os campos username, senha, email e CNPJ são obrigatórios.",
      });
    }
    if (password.length < 8) {
      return res.status(400).json({ message: "A senha deve ter pelo menos 8 caracteres." });
    }
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Nome de usuário já está em uso." });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      email,
      cnpj,
      companyName: companyName || cnpj,
      isActive: typeof isActive === "boolean" ? isActive : true,
      permiss,
      password: hashedPassword,
    });
    await newUser.save();
    res.status(201).json({ message: "Usuário registrado com sucesso!" });
  } catch (error) {
    console.error("Erro ao registrar usuário:", error);
    res.status(500).json({
      message: "Erro no servidor. Não foi possível registrar o usuário.",
      error: error.message,
    });
  }
});

// Rota para obter o perfil do usuário autenticado
router.get("/users/me", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado." });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar perfil", error: error.message });
  }
});

// Rota para atualizar o perfil do usuário autenticado
router.put("/users/me", authenticateToken, async (req, res) => {
  const { username, email, cnpj, empresaNome, permiss, password } = req.body;
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado." });
    }
    user.username = username || user.username;
    user.email = email || user.email;
    user.cnpj = cnpj || user.cnpj;
    user.companyName = companyName || user.companyName;
    user.permiss = permiss || user.permiss;
    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }
    await user.save();
    res.status(200).json({
      message: "Perfil atualizado com sucesso.",
      user: {
        username: user.username,
        email: user.email,
        cnpj: user.cnpj,
        companyName: user.companyName,
        permiss: user.permiss,
        isActive: user.isActive,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Erro ao atualizar perfil", error: error.message });
  }
});

// Middleware para verificar o token
router.get("/verify-token", (req, res) => {
  const token = req.cookies.authToken;
  if (!token) {
    return res.status(401).json({ isValid: false, message: "Token não encontrado." });
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ isValid: false, message: "Token inválido ou expirado." });
    }
    res.status(200).json({ isValid: true, user: decoded });
  });
});

module.exports = router;