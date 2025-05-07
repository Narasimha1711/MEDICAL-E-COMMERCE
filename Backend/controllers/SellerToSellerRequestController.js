const express = require('express');
const router = express.Router();
const SellerToSellerRequest = require('../models/SellerToSellerRequest');
const SellerModel = require('../models/SellerSchema');
const jwt = require('jsonwebtoken');

const secret = 'thisissecret';

/**
 * Internal reusable function to verify seller from token.
 */
const verifySeller = async (req) => {
  const token = req.cookies.token1;

  if (!token) {
    throw { status: 401, message: 'Unauthorized. Please login again.', path: '/login' };
  }

  return new Promise((resolve, reject) => {
    jwt.verify(token, secret, async (err, decoded) => {
      if (err) {
        reject({ status: 403, message: 'Token verification failed. Please login again.' });
      }

      try {
        const seller = await SellerModel.findById(decoded.id);
        console.log(seller);
        if (!seller) {
          reject({ status: 404, message: 'Seller not found. Access denied.' });
        } else {
          resolve(seller);
        }
      } catch (err) {
        reject({ status: 500, message: 'Error verifying seller.' });
      }
    });
  });
};

/**
 * Controller to get the authenticated seller's ID.
 */
const getSellerId = async (req, res) => {
  try {
    console.log("hiuguyfuyfiu");
    const seller = await verifySeller(req);
    return res.status(200).json({
      success: true,
      sellerId: seller._id,
    });
  } catch (error) {
    return res.status(error.status || 500).json({
      success: false,
      message: error.message || 'Server error',
      path: error.path || undefined,
    });
  }
};

/**
 * Controller to get only sellerId (shopName, email), medicineName, quantity
 * for all seller-to-seller requests that are available (i.e., no bulkBuyerId).
 */
const getAvailableSellerToSellerRequests = async (req, res) => {
  try {
    await verifySeller(req); // Ensure the requester is an authenticated seller

    const availableRequests = await SellerToSellerRequest.find({ bulkBuyerId: { $exists: false } })
      .populate('sellerId', 'shopName email') // Only select required fields from seller
      .select('sellerId medicineName quantity price'); // 👈 Add 'price' here

    return res.status(200).json({
      success: true,
      count: availableRequests.length,
      data: availableRequests,
    });
  } catch (error) {
    return res.status(error.status || 500).json({
      success: false,
      message: error.message || 'Server error',
      path: error.path || undefined,
    });
  }
};

/**
 * Controller to handle buying a bulk order from a seller-to-seller request.
 * Checks inventory, updates stock, and processes the purchase.
 */
const mongoose = require('mongoose');

const buyBulkOrder = async (req, res) => {
  const { requestId, flag, medicineDetails } = req.body;

  if (!requestId || !flag) {
    return res.status(400).json({
      success: false,
      message: 'requestId and flag are required.',
    });
  }

  try {
    // Verify the buyer's identity
    const buyer = await verifySeller(req);

    // If the buyer is not verified, return a 403 error
    if (!buyer) {
      return res.status(403).json({
        success: false,
        message: 'Buyer not authorized.',
      });
    }

    // Find the seller's request
    const request = await SellerToSellerRequest.findById(requestId)
      .populate('sellerId', 'shopName email');

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Request not found.',
      });
    }

    const seller = request.sellerId; // The seller fulfilling the order

    // Ensure medicinesUploaded is initialized as an empty array if undefined
    if (!seller.medicinesUploaded) {
      seller.medicinesUploaded = [];
    }

    // Initialize buyer's medicinesUploaded if it doesn't exist
    if (!buyer.medicinesUploaded) {
      buyer.medicinesUploaded = [];
    }

    // Handle flag logic
    if (flag === 1) {
      // Check if the medicine exists in the buyer's inventory
      const existingMedicineInBuyerInventory = buyer.medicinesUploaded.find(
        (med) => med.medicine === request.medicineName
      );

      if (existingMedicineInBuyerInventory) {
        // If the medicine already exists, add the quantity
        existingMedicineInBuyerInventory.count += request.quantity;
      } else {
        // This should not happen for flag === 1, as the frontend ensures the medicine exists
        return res.status(400).json({
          success: false,
          message: 'Medicine not found in buyer inventory for flag 1.',
        });
      }
    } else if (flag === 2) {
      if (!medicineDetails) {
        return res.status(400).json({
          success: false,
          message: 'medicineDetails is required for flag 2.',
        });
      }

      // Validate required fields for new medicine entry
      const { medicineName, count, price } = medicineDetails;
      if (!medicineName || !count || !price) {
        return res.status(400).json({
          success: false,
          message: 'medicineName, count, and price are required for flag 2.',
        });
      }

      // Add new medicine to buyer's inventory with all details
      buyer.medicinesUploaded.push({
        _id: new mongoose.Types.ObjectId(), // Generate a new unique ID
        seller: buyer._id.toString(), // Set seller to the buyer's ID
        medicine: medicineDetails.medicineName,
        count: parseInt(medicineDetails.count),
        price: parseFloat(medicineDetails.price),
        discount: parseFloat(medicineDetails.discount) || 0,
        discountedPrice: parseFloat(medicineDetails.discountedPrice) || parseFloat(medicineDetails.price),
        description: medicineDetails.description || '',
        category: medicineDetails.category || 'tablets',
        image: medicineDetails.image || '',
      });
    } else {
      return res.status(400).json({
        success: false,
        message: 'Invalid flag value. Must be 1 or 2.',
      });
    }

    // Save the buyer's updated inventory
    await buyer.save();

    // Mark the request as fulfilled by setting the bulkBuyerId
    request.bulkBuyerId = buyer._id;
    await request.save();

    // Return success response with the updated requestId
    return res.status(201).json({
      success: true,
      message: 'Bulk order purchased and added to your inventory.',
      requestId: request._id,
    });
  } catch (error) {
    console.error(error);
    return res.status(error.status || 500).json({
      success: false,
      message: error.message || 'Server error.',
      path: error.path || undefined,
    });
  }
};

/**
 * Controller to handle adding a new bulk order.
 * Verifies the seller, checks inventory, and creates a new bulk order request.
 */
const addBulkOrder = async (req, res) => {
  const { medicineName, quantity, price } = req.body;

  if (!medicineName || !quantity || !price) {
    return res.status(400).json({
      success: false,
      message: 'medicineName, quantity, and price are required.',
    });
  }

  try {
    const seller = await verifySeller(req);
    const medicine = seller.medicinesUploaded.find(med => med.medicine === medicineName);

    if (!medicine) {
      return res.status(404).json({
        success: false,
        message: 'Medicine not found in your inventory.',
      });
    }

    if (medicine.count < quantity) {
      return res.status(400).json({
        success: false,
        message: `Insufficient stock. Only ${medicine.count} units available.`,
      });
    }

    // Adjust inventory: delete if exact match, else reduce
    if (medicine.count === quantity) {
      seller.medicinesUploaded = seller.medicinesUploaded.filter(med => med.medicine !== medicineName);
    } else {
      medicine.count -= quantity;
    }

    await seller.save();

    const newRequest = new SellerToSellerRequest({
      sellerId: seller._id,
      type: 'sell',
      medicineName,
      quantity,
      price,
      totalCost: price * quantity,
    });

    await newRequest.save();

    return res.status(201).json({
      success: true,
      message: 'Bulk order request created successfully.',
      requestId: newRequest._id,
    });
  } catch (error) {
    return res.status(error.status || 500).json({
      success: false,
      message: error.message || 'Server error.',
      path: error.path || undefined,
    });
  }
};

// Define the route for getSellerId
router.get('/getSellerId', getSellerId);

module.exports = {
  getAvailableSellerToSellerRequests,
  buyBulkOrder,
  addBulkOrder,
  getSellerId,
};