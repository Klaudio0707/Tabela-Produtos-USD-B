const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: { 
    type: String,required: [true, "O campo 'username' é obrigatório"], unique: true },
  email: { type: String, required: [true, "O campo 'email' é obrigatório"],unique: true},
  cnpj: { type: String, required: [true, "O campo 'CNPJ' é obrigatório"] },
  companyName: { type: String, required: [true, "O campo 'Nome da Empresa' é obrigatório"]},
  isActive: { type: Boolean, default: true, required: [true, "O campo 'isActive' é obrigatório"]},
  permiss: {
    type: String,required: [true, "O campo 'permiss' é obrigatório"],
    enum: {
      values: ["admin", "user", "guest"],
      message: "O valor de 'permiss' deve ser 'admin', 'user' ou 'guest'"
    }
  },
  
  password: {
    type: String,
    required: [true, "O campo 'password' é obrigatório"],
    minlength: [6, "A senha deve ter pelo menos 6 caracteres"]
  }
}, 
{
  timestamps: true
});

// Evita sobrescrita do modelo se já estiver registrado
const User = mongoose.models.User || mongoose.model("User", UserSchema);

module.exports = User;
