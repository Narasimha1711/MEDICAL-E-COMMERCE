import { User, Seller, Product, DashboardStats } from '../types';

// Generate random users
export const users = Array.from({ length: 20 }, (_, i) => ({
  id: `user-${i + 1}`,
  name: `User ${i + 1}`,
  email: `user${i + 1}@gmail.com`,
  role: i % 5 === 0 ? 'admin' : 'customer',
  status: i % 4 === 0 ? 'inactive' : 'active',
  joinedDate: new Date(Date.now() - Math.floor(Math.random() * 365 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0],
}));

// Generate random sellers
export const sellers = Array.from({ length: 15 }, (_, i) => ({
  id: `seller-${i + 1}`,
  name: `Pharmacy ${i + 1}`,
  email: `pharmacy${i + 1}@gmail.com`,
  phone: `+1-555-${100 + i}-${1000 + i}`,
  address: `${100 + i} Main Street, City ${i + 1}`,
  status: i % 5 === 0 ? 'pending' : i % 7 === 0 ? 'suspended' : 'active',
  joinedDate: new Date(Date.now() - Math.floor(Math.random() * 365 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0],
  totalProducts: Math.floor(Math.random() * 50) + 1,
  revenue: Math.floor(Math.random() * 100000) + 5000,
}));

// Medicine categories
const medicineCategories = [
  'Antibiotics',
  'Pain Relievers',
  'Antidepressants',
  'Antidiabetics',
  'Antihistamines',
  'Cardiovascular',
  'Dermatological',
  'Gastrointestinal',
  'Respiratory',
  'Vitamins',
];

// Generate random products
export const products = Array.from({ length: 50 }, (_, i) => {
  const sellerId = Math.floor(Math.random() * sellers.length);
  const stock = Math.floor(Math.random() * 200);
  let status = 'in-stock';
  
  if (stock === 0) {
    status = 'out-of-stock';
  } else if (stock < 10) {
    status = 'low-stock';
  }
  
  return {
    id: `product-${i + 1}`,
    name: `Medicine ${i + 1}`,
    category: medicineCategories[i % medicineCategories.length],
    price: Math.floor(Math.random() * 200) + 5,
    stock,
    sellerId: sellers[sellerId].id,
    sellerName: sellers[sellerId].name,
    status,
    expiryDate: new Date(Date.now() + Math.floor(Math.random() * 730 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0],
  };
});

// Dashboard stats
export const dashboardStats = {
  totalUsers: users.length,
  totalSellers: sellers.length,
  totalProducts: products.length,
  totalRevenue: sellers.reduce((sum, seller) => sum + seller.revenue, 0),
  recentUsers: users.slice(0, 5),
  recentSellers: sellers.slice(0, 5),
  recentProducts: products.slice(0, 5),
  revenue: [
    { label: 'Jan', value: 12500 },
    { label: 'Feb', value: 15000 },
    { label: 'Mar', value: 18000 },
    { label: 'Apr', value: 16500 },
    { label: 'May', value: 21000 },
    { label: 'Jun', value: 19500 },
    { label: 'Jul', value: 24000 },
  ],
};