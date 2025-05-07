const mongoose = require('mongoose');

const SellerToSellerRequest = new mongoose.Schema({
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'SellerSchema', required: true },
  type: { type: String, enum: ['buy', 'sell'], required: true },
  medicineName: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true }, // Price of the medicine
  totalCost: { 
    type: Number, 
    required: true, 
    default: function() {
      return this.price * this.quantity; // Calculate total cost based on price and quantity
    }
  },
  status: { type: String, enum: ['pending', 'fulfilled', 'cancelled'], default: 'pending' },
  bulkBuyerId: { type: mongoose.Schema.Types.ObjectId, ref: 'SellerSchema' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('SellerToSellerRequestS', SellerToSellerRequest);
