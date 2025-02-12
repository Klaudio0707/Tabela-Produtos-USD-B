const mongoose = require("mongoose"); // importando a biblioteca do mongoose

const connectDB = async () => { // função assíncrona
  try { //tenta
    await mongoose.connect(process.env.MONGO_URI, { // conecta ao banco 
      useNewUrlParser: true, //aceita as novas funções
      useUnifiedTopology: true, // 
    });
    console.log("Conectado ao MongoDB");
  } catch (error) { // caso dê errado, mostra o erro
    console.error("Erro ao conectar ao MongoDB", error);
    process.exit(1);
  }
};

module.exports = connectDB; // exportando a função
