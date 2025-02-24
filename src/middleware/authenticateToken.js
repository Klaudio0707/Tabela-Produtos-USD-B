const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  // Extrair o token do cookie
  const token = req.cookies["authToken"]; // O nome do cookie pode ser diferente

  if (!token) {
    return res.status(401).json({ message: "Token não fornecido" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Token inválido" });
    }
    req.user = decoded; // Adiciona o usuário ao objeto req
    next();
  });
};

module.exports = authenticateToken;
