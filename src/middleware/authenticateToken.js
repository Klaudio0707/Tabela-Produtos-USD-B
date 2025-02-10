const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
const token = req.headers['authorization'] ;
if( !token){
return res. status(401).json({message: 'token não fornecido'});
}
jwt.verify(token, process.env.JWT_SECRET || 'seusegredo', (err, user) => {
if(err) {

}

}
