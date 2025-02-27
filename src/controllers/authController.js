const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const SALT_ROUNDS = 10;
const JWT_EXPIRATION = "2h";

// Login do usuário
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
    console.error(`Erro no login: ${err.message}`);
    res.status(500).json({ message: "Erro no servidor.", error: err.message });
  }
};

// Registro de um novo usuário
exports.register = async (req, res) => {
  const { username, password, email, cnpj, permiss, empresaNome, isActive } = req.body;

  try {
    // Validação dos campos obrigatórios
    if (!username || !password || !email || !cnpj) {
      return res
        .status(400)
        .json({ message: "Os campos username, senha, email e CNPJ são obrigatórios." });
    }
    if (password.length < 8) {
      return res.status(400).json({ message: "A senha deve ter pelo menos 8 caracteres." });
    }

    // Verificar se o usuário já existe
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Usuário já existe." });
    }

    // Se empresaNome não for enviado, utiliza o próprio CNPJ
    const _empresaNome = empresaNome || cnpj;
    // Se isActive não for enviado, define false (ajuste conforme sua regra de negócio)
    const _isActive = typeof isActive === "boolean" ? isActive : false;

    // Gerar hash da senha
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    // Criar e salvar o novo usuário
    const newUser = new User({
      username,
      email,
      cnpj,
      empresaNome: _empresaNome,
      isActive: _isActive,
      permiss,
      password: hashedPassword,
    });
    await newUser.save();

    res.status(201).json({ message: "Usuário registrado com sucesso!" });
  } catch (err) {
    console.error(`Erro ao registrar usuário: ${err.message}`);
    res.status(500).json({ message: "Erro ao registrar usuário", error: err.message });
  }
};

// Obter o perfil do usuário autenticado
exports.getUserProfile = async (req, res) => {
  try {
    // req.user é definido pelo middleware de autenticação
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado." });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar perfil", error: error.message });
  }
};

// Atualizar os dados do usuário autenticado
exports.updateUserProfile = async (req, res) => {
  const { username, email, cnpj, empresaNome, permiss, password } = req.body;
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado." });
    }
    // Atualizar os campos, mantendo os antigos se não forem fornecidos novos valores
    user.username = username || user.username;
    user.email = email || user.email;
    user.cnpj = cnpj || user.cnpj;
    user.empresaNome = empresaNome || user.empresaNome;
    user.permiss = permiss || user.permiss;
    if (password) {
      user.password = await bcrypt.hash(password, SALT_ROUNDS);
    }
    await user.save();
    res.status(200).json({
      message: "Perfil atualizado com sucesso.",
      user: {
        username: user.username,
        email: user.email,
        cnpj: user.cnpj,
        empresaNome: user.empresaNome,
        permiss: user.permiss,
        isActive: user.isActive,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Erro ao atualizar perfil", error: error.message });
  }
};

// Obter todos os usuários (para fins administrativos)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("username email cnpj empresaNome permiss isActive");
    res.status(200).json(users);
  } catch (err) {
    console.error(`Erro ao buscar usuários: ${err.message}`);
    res.status(500).json({ message: "Erro ao buscar usuários.", error: err.message });
  }
};

