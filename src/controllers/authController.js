const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const SALT_ROUNDS = 10;
const JWT_EXPIRATION = "2h";

// Função reutilizável para validação de dados do usuário
const validateUserData = ({ username, email, empresa, permiss, password }) => {
  if (!username || !password || !email || !permiss || !empresa) {
    return "Todos os campos são obrigatórios.";
  }
  if (!/\^\S+@\S+\.\S+$/.test(email)) {
    return "Email inválido.";
  }
  if (!["admin", "user", "guest"].includes(permiss)) {
    return "Permissão deve ser admin, user ou guest.";
  }
  if (password.length < 8) {
    return "A senha deve ter pelo menos 8 caracteres.";
  }
  return null; // Tudo válido
};

// Login de usuário
exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Senha incorreta." });
    }

    const token = jwt.sign(
      { id: user._id, username: user.username, permiss: user.permiss },
      process.env.JWT_SECRET,
      { expiresIn: JWT_EXPIRATION }
    );

    res.status(200).json({ message: "Usuário logado com sucesso.", token });
  } catch (err) {
    console.error(`Erro ao realizar login: ${err.message}`);
    res.status(500).json({ message: "Erro no servidor.", error: err.message });
  }
};

// Registro de um novo usuário
exports.register = async (req, res) => {
  const { username, email, empresa, permiss, password } = req.body;

  try {
    const validationError = validateUserData(req.body);
    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Usuário já existe." });
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    const newUser = new User({
      username,
      email,
      empresa,
      permiss,
      password: hashedPassword,
    });

    await newUser.save();
    res.status(201).json({ message: "Usuário registrado com sucesso." });
  } catch (err) {
    console.error(`Erro ao registrar usuário: ${err.message}`);
    res.status(500).json({ message: "Erro ao registrar usuário.", error: err.message });
  }
};

// Obter todos os usuários
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("username email empresa permiss");
    res.status(200).json(users);
  } catch (err) {
    console.error(`Erro ao buscar usuários: ${err.message}`);
    res.status(500).json({ message: "Erro ao buscar usuários.", error: err.message });
  }
};
