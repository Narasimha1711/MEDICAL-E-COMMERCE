export const User = {
  id: String,
  name: String,
  email: String,
  status: ['active', 'inactive'],
  joinedDate: String,
};

export const Seller = {
  id: String,
  name: String,
  email: String,
  status: ['active', 'pending', 'suspended'],
  revenue: Number,
  totalProducts: Number,
};

export const Product = {
  id: String,
  name: String,
  category: String,
  price: Number,
  stock: Number,
  sellerId: String,
  sellerName: String,
  status: ['in-stock', 'low-stock', 'out-of-stock'],
  expiryDate: String,
};

export const DashboardStats = {
  totalUsers: Number,
  totalSellers: Number,
  totalProducts: Number,
  totalRevenue: Number,
  recentUsers: Array,
  recentSellers: Array,
  recentProducts: Array,
  revenue: [{ label: String, value: Number }],
};