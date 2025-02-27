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
  const { username, password, email, cnpj, empresaNome, permiss, isActive } = req.body;

  try {
    // Validação de campos obrigatórios
    if (!username || !password || !email || !cnpj) {
      return res.status(400).json({
        message: "Os campos username, senha, email e CNPJ são obrigatórios."
      });
    }
    if (password.length < 8) {
      return res
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

    // Se empresaNome não for enviado, utiliza o próprio CNPJ como fallback
    const _empresaNome = empresaNome || cnpj;
    // Se isActive não for enviado, define true ou false conforme sua regra (aqui usamos true como padrão)
    const _isActive = typeof isActive === "boolean" ? isActive : true;

    // Gerar hash da senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // Criar e salvar o novo usuário
    const newUser = new User({
      username,
      email,
      cnpj,
      companyName: _empresaNome,
      isActive: _isActive,
      permiss,
      password: hashedPassword,
    });
    await newUser.save();

    // Retornar mensagem de sucesso
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
    // Atualiza os campos (mantendo os antigos se não forem enviados novos valores)
    user.username = username || user.username;
    user.email = email || user.email;
    user.cnpj = cnpj || user.cnpj;
    user.companyName = empresaNome || user.companyName;
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

