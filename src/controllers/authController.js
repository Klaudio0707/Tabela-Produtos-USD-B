const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

exports.login = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado' });

        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Senha incorreta' });

        }
        const token = jwt.sign({ id: user._id }, 'SeuSegredoJWT', { expiresIn: '2h' });
        res.json({ token });
    } catch (err) {
        res.status(500).json({ message: 'Erro no servidor' });

    }
};
exports.register = async (req, res) => {
const {username, password} = req.body;
try{
    const existingUser = await User.findOne({username});
    if(existingUser){
        return res.status(400).json({message: 'Usuário já existe'});

    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword});
    await newUser.save();
    res.status(201).json({message: 'Usuário registrado com sucesso!'});
} catch (err) {
    res.status(5001).json({messaage: 'Erro ao registrar usuário', error: err.message });
}

}
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}, '-password'); // Exclui o campo de senha
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar usuários', error });
    }
};