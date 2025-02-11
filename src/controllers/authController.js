const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Senha incorreta" });
    }
    //Gerar token jwt
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "2h",
    });

    res
      .status(200)
      .json({ token: "Parabéns, Usuário logado com sucesso " + token });
  } catch (err) {
    res.status(500).json({ message: "Erro no servidor", error: err.message });
  }
};

// Registro de um novo usuário
exports.register = async (req, res) => {
  const { username, password } = req.body;
  try {
    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Nome de usuário e senha são obrigatorios" });
    }
    if (password.length < 8) {
      return res
        .status(400)
        .json({ message: "A senha deve ter pelo menos 8 caracteres" });
    }
    //Verificar se o usuário já existe
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Usuário já existe" });
    }
    //Criar senha com hash
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();
    res.status(201).json({ message: "Usuário registrado com sucesso!" });
  } catch (err) {
    console.error(`Erro ao registrar usuário: ${err.message}`);
    res
      .status(500)
      .json({ message: "Erro ao registrar usuário", error: err.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, "-password"); // Exclui o campo de senha
    res.status(200).json(users);
  } catch (err) {
    console.error(`Erro ao buscar usuários: ${err.message}`);
    res.status(500).json({ message: "Erro ao buscar usuários", err });
  }
};
