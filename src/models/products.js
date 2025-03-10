const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, index: true },
  manufacturer: { type: String, required: true, trim: true, index: true },
  origin: { type: String, required: true, trim: true, index: true },
  package: { type: String, required: true, trim: true, index: true },
  currency: { type: String, enum: ["BRL", "USD"], default: "BRL" }, // Aceita apenas BRL ou USD.
  price: { type: Number, required: true, min: 0 }, // valor numérico obrigatório.

  createdAt: { type: Date, default: Date.now }, // Data de criação.
});

module.exports = mongoose.model("Product", productSchema);
