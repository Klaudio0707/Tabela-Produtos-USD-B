const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const user = require('../models/user');

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