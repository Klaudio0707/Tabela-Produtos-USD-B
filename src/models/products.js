const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    manufacturer: { type: String, required: true },
    origin: { type: String }, // campo opcional.
    package: { type: String }, // campo opcional.
    currency: { type: String, enum: ['BRL', 'USD'], default: 'BRL' }, // Aceita apenas BRL ou USD
    priceInside: { type: Number, required: true }, // valor numérico obrigatório.
    priceOutside: { type: Number }, // valor numérico opcional.
    ipi: { type: Boolean, default: false }, // booleano para indicar se tem IPi.
    ipiRate: { type: Number, default: 0 }, // taxa de IPI (em %), padrão 0.
    createdAt: { type: Date, default: Date.now }, // Data de criação
});

module.exports = mongoose.model('Product', productSchema);