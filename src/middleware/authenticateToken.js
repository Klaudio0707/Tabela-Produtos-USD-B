const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
const token = req.headers['authorization'] ;
if( !token){
return res. status(401).json({message: 'token não fornecido'});
}
jwt.verify(token, process.env.JWT_SECRET || 'seusegredo', (err, user) => {
if(err) {
    return res.status(403).json({ message: 'Token inválido'});
}
req.user = user; //adiciona o usuário ao objeto do req 
next();

});
}

module.exports = authenticateToken;
