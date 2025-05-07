const User = require("../models/UserModel");
const Seller = require("../models/SellerModel");
const Medicine = require("../models/MedicineModel");
const Order = require("../models/OrderModel");
const asyncHandler = require("express-async-handler");

const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find();
  res.status(200).json({ message: users, length1: users.length });
});

const getSellers = asyncHandler(async (req, res) => {
  const sellers = await Seller.find();
  res.status(200).json({ message: sellers, length2: sellers.length });
});

const getMedicines = asyncHandler(async (req, res) => {
  const medicines = await Medicine.find();
  res.status(200).json({ message: medicines, length3: medicines.length });
});

const getOut = asyncHandler(async (req, res) => {
  try {
    const lowStockCount = await Medicine.countDocuments({
      count: { $lte: 5 },
    });
    res.status(200).json({
      success: true,
      lowStockCount,
      message: `There are ${lowStockCount} medicines with stock less than or equal to 5.`,
    });
  } catch (error) {
    console.error("Error fetching low-stock medicines:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching low-stock medicines",
    });
  }
});

const getOrders = asyncHandler(async (req, res) => {
  try {
    const orders = await Order.find();
    const totalOrders = orders.length;
    res.status(200).json({
      success: true,
      totalOrders,
      orders,
      message: `Total number of orders: ${totalOrders}`,
    });
  } catch (error) {
    console.error("Error fetching total orders:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching total number of orders",
    });
  }
});

const getLatest = asyncHandler(async (req, res) => {
  try {
    const latestUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(5);
    res.status(200).json({ success: true, latestUsers, message: "success" });
  } catch (err) {
    console.error("Error fetching latest users:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

const getRevenue = asyncHandler(async (req, res) => {
  try {
    const result = await Order.aggregate([
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$totalAmount" },
        },
      },
    ]);
    const totalRevenue = result.length > 0 ? result[0].totalRevenue : 0;
    res.status(200).json({
      success: true,
      totalRevenue,
    });
  } catch (error) {
    console.error("Error calculating revenue:", error);
    res.status(500).json({
      success: false,
      message: "Server error while calculating revenue",
    });
  }
});

const getMonthlyRevenue = asyncHandler(async (req, res) => {
  try {
    const result = await Order.aggregate([
      {
        $group: {
          _id: { $month: "$createdAt" },
          value: { $sum: "$totalAmount" },
        },
      },
      {
        $sort: { "_id": 1 },
      },
    ]);

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const monthlyRevenue = months.map((label, index) => {
      const monthData = result.find((r) => r._id === index + 1);
      return {
        label,
        value: monthData ? monthData.value : 0,
      };
    });

    res.status(200).json({
      success: true,
      monthlyRevenue,
    });
  } catch (error) {
    console.error("Error fetching monthly revenue:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching monthly revenue",
    });
  }
});

const putUsers = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error(`No user found with id ${req.params.id}`);
  }
  const { username, email, password } = req.body;
  if (!username || !email) {
    res.status(400);
    throw new Error("Username and email are mandatory");
  }
  const updatedUser = await User.findByIdAndUpdate(
    req.params.id,
    { username, email, password: password || user.password },
    { new: true }
  );
  res.status(200).json({ message: updatedUser });
});

const postUsers = asyncHandler(async (req, res) => {
  console.log("the body of the request is :", req.body);
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    res.status(400);
    throw new Error("All the fields are mandatory");
  }
  const user = await User.create({
    username,
    email,
    password,
  });
  res.status(201).json({ message: user });
});
const deleteUsers = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error(`No user found with id ${req.params.id}`);
  }
  await user.deleteOne();
  res.status(200).json({ message: { id: req.params.id } });
});

module.exports = {
  getUsers,
  getSellers,
  getMedicines,
  putUsers,
  getOut,
  getRevenue,
  getOrders,
  getLatest,
  getMonthlyRevenue,
  putUsers,
  postUsers,
  deleteUsers,
};