// models/ticket.js
const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  code: { type: String, unique: true },
  purchase_datetime: { type: Date, default: Date.now },
  amount: Number,
  purchaser: String,
  products: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    quantity: Number,
  }],
});

const Ticket = mongoose.model('Ticket', ticketSchema);

module.exports = Ticket;
