const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, index: true },
  manufacturer: { type: String, required: true, trim: true, index: true },
  origin: { type: String, required: true, trim: true, index: true },
  package: { type: String, required: true, trim: true, index: true }, 
  currency: { type: String, enum: ['BRL', 'USD'], default: 'BRL' }, // Aceita apenas BRL ou USD.
  priceInside: { type: Number, required: true, min: 0 }, // valor numérico obrigatório.
  priceOutside: { type: Number, min: 0 }, // valor numérico opcional e positivo.
  ipi: { type: Boolean, default: false }, // booleano para indicar se tem IPI.
  ipiRate: { 
    type: Number, 
    default: 0,
    validate: {
      validator: function(value) {
        return this.ipi ? value > 0 : true;
      },
      message: 'ipiRate deve ser maior que 0 quando ipi for verdadeiro.',
    },
  },
  createdAt: { type: Date, default: Date.now }, // Data de criação.
});

module.exports = mongoose.model('Product', productSchema);