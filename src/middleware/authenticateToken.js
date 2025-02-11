const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  const authHedaer = req.headers["authorization"];
  if (!authHedaer) {
    return res.status(401).json({ message: "token não fornecido" });
  }

  const token = authHedaer.split("")[1];
  if (!token) {
    return res.status(401).json({ message: "Token não formado" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Token inválido" });
    }
    req.user = decoded; //adiciona o usuário ao objeto do req
    next();
  });
};

module.exports = authenticateToken;
