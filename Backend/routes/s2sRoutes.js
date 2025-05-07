const express = require('express');
const router = express.Router();

const { 
  getAvailableSellerToSellerRequests, 
  addBulkOrder,
  buyBulkOrder,
  getSellerId // Assuming the function is already defined in your controller
} = require('../controllers/SellerToSellerRequestController');

// @route   GET /api/s2s/availableStock
// @desc    Get all seller-to-seller requests where no bulk buyer has claimed yet
// @access  Public or Authenticated (adjust based on your needs)
router.get('/availableStock', getAvailableSellerToSellerRequests);

// @route   POST /api/s2s/addbulkorder
// @desc    Add a bulk order
// @access  Authenticated (requires login or user verification)
router.post('/addbulkorder', addBulkOrder);

// @route   POST /api/s2s/buybulkorder
// @desc    Place a bulk order for a seller-to-seller request
// @access  Authenticated (requires login or user verification)
router.post('/buybulkorder', buyBulkOrder);

router.get('/get-seller-id', getSellerId);

module.exports = router;
