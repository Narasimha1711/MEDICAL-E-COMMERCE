const express = require('express');
const bcryptjs = require('bcryptjs');
const SellerModel = require('../models/SellerSchema');
const SellerToSellerRequest = require('../models/SellerToSellerRequest');

const router = express.Router();

// Seller-to-Seller Login (no signup)
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const seller = await SellerModel.findOne({ email });
  if (!seller) return res.status(401).json({ message: 'No seller found' });
  let isValid = false;
  try {
    isValid = bcryptjs.compareSync(password, seller.password);
  } catch (e) {
    isValid = false;
  }
  // Fallback: allow plain text match for dev/testing
  if (!isValid && password === seller.password) {
    isValid = true;
  }
  if (!isValid) return res.status(401).json({ message: 'Invalid credentials' });
  res.json({ seller });
});

// Create a seller-to-seller buy/sell request
router.post('/request', async (req, res) => {
  const { sellerId, type, medicineName, quantity } = req.body;
  if (!sellerId || !type || !medicineName || !quantity) {
    return res.status(400).json({ message: 'Missing fields' });
  }
  const request = await SellerToSellerRequest.create({ sellerId, type, medicineName, quantity });
  res.status(201).json(request);
});

// Get all medicines for a seller
router.get('/seller-medicines/:sellerId', async (req, res) => {
  const seller = await SellerModel.findById(req.params.sellerId);
  if (!seller) return res.status(404).json({ message: 'Seller not found' });
  // Always provide a 'name' property for frontend compatibility
  const medicines = (seller.medicinesUploaded || []).map(med => ({
    ...med._doc,
    name: med.medicine || med.name || ''
  }));
  res.json(medicines);
});

// Get all seller-to-seller requests
router.get('/requests', async (req, res) => {
  const requests = await SellerToSellerRequest.find().populate('sellerId', 'shopName email');
  res.json(requests);
});

// Fulfill a seller-to-seller request
router.post('/fulfill', async (req, res) => {
  const { reqId, sellerId } = req.body;
  const request = await SellerToSellerRequest.findById(reqId);
  if (!request || request.status !== 'pending') return res.status(400).json({ message: 'Invalid request' });

  // Update medicine stock for both sellers
  const sellerFrom = await SellerModel.findById(request.sellerId);
  const sellerTo = await SellerModel.findById(sellerId);
  if (!sellerFrom || !sellerTo) return res.status(400).json({ message: 'Sellers not found' });

  // Find medicine in sellerFrom
  const medFrom = sellerFrom.medicinesUploaded.find(m => m.name === request.medicineName);
  if (!medFrom || medFrom.count < request.quantity) {
    return res.status(400).json({ message: 'Not enough stock' });
  }
  medFrom.count -= request.quantity;
  // If count is 0, remove medicine from inventory
  if (medFrom.count === 0) {
    sellerFrom.medicinesUploaded = sellerFrom.medicinesUploaded.filter(m => m.name !== request.medicineName);
  }
  // Add/increment medicine in sellerTo
  let medTo = sellerTo.medicinesUploaded.find(m => m.name === request.medicineName);
  if (medTo) {
    medTo.count += request.quantity;
  } else {
    sellerTo.medicinesUploaded.push({
      name: request.medicineName,
      count: request.quantity,
      price: medFrom.price || 0,
      description: medFrom.description || '',
      category: medFrom.category || '',
      discount: medFrom.discount || 0,
      discountedPrice: medFrom.discountedPrice || 0
    });
  }
  await sellerFrom.save();
  await sellerTo.save();
  request.status = 'fulfilled';
  request.targetSellerId = sellerId;
  await request.save();
  res.json({ message: 'Request fulfilled', request });
});

module.exports = router;
