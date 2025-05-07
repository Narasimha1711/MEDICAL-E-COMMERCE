import { create } from 'zustand';
import axios from 'axios';

// Set base URL for axios to backend
axios.defaults.baseURL = 'http://localhost:9004';

const useStore = create((set) => ({
  users: [],
  sellers: [],
  products: [],
  stats: {
    totalUsers: 0,
    recentUsers: [],
    totalSellers: 0,
    recentSellers: [],
    totalProducts: 0,
    recentProducts: [],
    totalRevenue: 0,
    revenue: [
      { label: 'Jan', value: 500 },
      { label: 'Feb', value: 600 },
      { label: 'Mar', value: 700 },
      { label: 'Apr', value: 800 },
      { label: 'May', value: 900 },
      { label: 'Jun', value: 0 },
      { label: 'Jul', value: 0 },
      { label: 'Aug', value: 0 },
      { label: 'Sep', value: 0 },
      { label: 'Oct', value: 0 },
      { label: 'Nov', value: 0 },
      { label: 'Dec', value: 0 },
    ],
  },
  loading: false,
  error: null,

  fetchStats: async (retries = 3) => {
    set({ loading: true, error: null });
    console.log('Starting fetchStats, retries left:', retries);

    const endpoints = [
      '/api/users',
      '/api/user',
      '/api/sellers',
      '/api/medicine',
      '/api/orders',
      '/api/monthly-revenue',
      '/api/order',
    ];

    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        console.log(`Fetch attempt ${attempt} of ${retries}`);
        const responses = await Promise.all(
          endpoints.map(async (url) => {
            console.log(`Fetching ${url}`);
            const response = await axios.get(url, { timeout: 5000 });
            console.log(`Success: ${url}`, response.data);
            return response;
          })
        );

        const [
          usersResponse,
          latestUsersResponse,
          sellersResponse,
          medicinesResponse,
          revenueResponse,
          monthlyRevenueResponse,
          ordersResponse,
        ] = responses;

        // Validate responses
        if (!usersResponse.data?.message || !Array.isArray(usersResponse.data.message)) {
          throw new Error('Invalid users data');
        }
        if (!latestUsersResponse.data?.latestUsers || !Array.isArray(latestUsersResponse.data.latestUsers)) {
          throw new Error('Invalid latest users data');
        }
        if (!sellersResponse.data?.message || !Array.isArray(sellersResponse.data.message)) {
          throw new Error('Invalid sellers data');
        }
        if (!medicinesResponse.data?.message || !Array.isArray(medicinesResponse.data.message)) {
          throw new Error('Invalid medicines data');
        }
        if (typeof revenueResponse.data?.totalRevenue !== 'number') {
          throw new Error('Invalid revenue data');
        }
        if (!monthlyRevenueResponse.data?.monthlyRevenue || !Array.isArray(monthlyRevenueResponse.data.monthlyRevenue)) {
          throw new Error('Invalid monthly revenue data');
        }
        if (!ordersResponse.data?.orders || !Array.isArray(ordersResponse.data.orders)) {
          throw new Error('Invalid orders data');
        }

        // Process data
        const users = usersResponse.data.message.map((u) => ({
          id: u._id || Date.now().toString(),
          name: u.username || 'Unknown',
          email: u.email || 'N/A',
          role: u.role || 'user',
          status: (u.status || 'active').toLowerCase(),
          joinedDate: u.createdAt ? new Date(u.createdAt).toISOString().split('T')[0] : 'Unknown',
        }));

        const recentUsers = latestUsersResponse.data.latestUsers.map((u) => ({
          id: u._id || Date.now().toString(),
          name: u.username || 'Unknown',
          email: u.email || 'N/A',
          status: (u.status || 'active').toLowerCase(),
          joinedDate: u.createdAt ? new Date(u.createdAt).toISOString().split('T')[0] : 'Unknown',
        }));

        const sellers = sellersResponse.data.message.map((s) => ({
          id: s._id || Date.now().toString(),
          name: s.shopName || 'Unknown',
          email: s.email || 'N/A',
          status: (s.status || 'active').toLowerCase(),
          totalProducts: 0, // Will compute below
          revenue: 0, // Will compute below
          joinedDate: s.createdAt ? new Date(s.createdAt).toISOString().split('T')[0] : 'Unknown',
        }));

        const medicines = medicinesResponse.data.message.map((p) => {
          const stock = p.count || 0;
          const status = stock > 10 ? 'in-stock' : stock > 0 ? 'low-stock' : 'out-of-stock';
          return {
            id: p._id || Date.now().toString(),
            name: p.name || 'Unknown',
            category: p.category || 'Unknown',
            price: p.price || 0,
            stock,
            sellerId: p.sellerId || sellers.find((s) => s.name === p.seller)?._id || 'Unknown',
            sellerName: p.seller || 'Unknown',
            status: status.toLowerCase(),
            expiryDate: p.expiryDate ? new Date(p.expiryDate).toISOString().split('T')[0] : 'Unknown',
          };
        });

        const orders = ordersResponse.data.orders;

        // Compute seller totalProducts and revenue
        const sellerRevenueMap = {};
        const sellerProductCount = {};
        sellers.forEach((seller) => {
          sellerRevenueMap[seller.id] = 0;
          sellerProductCount[seller.id] = 0;
        });

        medicines.forEach((medicine) => {
          const seller = sellers.find((s) => s.id === medicine.sellerId || s.name === medicine.sellerName);
          if (seller) {
            sellerProductCount[seller.id]++;
          }
        });

        orders.forEach((order) => {
          order.products.forEach((product) => {
            const medicine = medicines.find((m) => m.id === product._id);
            if (medicine) {
              const seller = sellers.find((s) => s.id === medicine.sellerId || s.name === medicine.sellerName);
              if (seller) {
                sellerRevenueMap[seller.id] =
                  (sellerRevenueMap[seller.id] || 0) + (product.discountedPrice || product.price || 0) * (product.count || 1);
              }
            }
          });
        });

        console.log('Seller computations:', { sellerProductCount, sellerRevenueMap });

        // Update sellers with computed values
        const updatedSellers = sellers.map((seller) => ({
          ...seller,
          totalProducts: sellerProductCount[seller.id] || 0,
          revenue: sellerRevenueMap[seller.id] || 0,
        }));

        const recentSellers = updatedSellers
          .sort((a, b) => new Date(b.joinedDate || 0) - new Date(a.joinedDate || 0))
          .slice(0, 5)
          .map((s) => ({
            id: s.id,
            name: s.name,
            email: s.email,
            status: s.status,
            revenue: s.revenue,
          }));

        const recentProducts = medicines.slice(0, 5);
        console.log('Recent products for dashboard:', recentProducts);

        const statsData = {
          totalUsers: usersResponse.data.length1 || users.length,
          recentUsers,
          totalSellers: sellersResponse.data.length2 || updatedSellers.length,
          recentSellers,
          totalProducts: medicinesResponse.data.length3 || medicines.length,
          recentProducts,
          totalRevenue: revenueResponse.data.totalRevenue || 0,
          revenue: monthlyRevenueResponse.data.monthlyRevenue || stats.revenue,
        };

        console.log('Stats fetched successfully:', statsData);
        console.log('Processed data:', { users, sellers: updatedSellers, products: medicines });
        set({
          users,
          sellers: updatedSellers,
          products: medicines,
          stats: statsData,
          loading: false,
        });
        return;
      } catch (err) {
        console.error(`Attempt ${attempt} failed:`, err.message, err.response?.data);
        if (attempt === retries) {
          console.warn('All fetch attempts failed, using fallback data');
          const fallbackStats = {
            totalUsers: 10,
            recentUsers: [
              { id: '1', name: 'Sample User 1', email: 'user1@example.com', status: 'active', joinedDate: '2025-05-07' },
              { id: '2', name: 'Sample User 2', email: 'user2@example.com', status: 'active', joinedDate: '2025-05-06' },
            ],
            totalSellers: 5,
            recentSellers: [
              { id: '1', name: 'Sample Seller 1', email: 'seller1@example.com', status: 'active', revenue: 1000, totalProducts: 10 },
              { id: '2', name: 'Sample Seller 2', email: 'seller2@example.com', status: 'active', revenue: 500, totalProducts: 5 },
            ],
            totalProducts: 20,
            recentProducts: [
              {
                id: '1',
                name: 'Sample Product 1',
                category: 'General',
                price: 10,
                stock: 100,
                sellerId: '1',
                sellerName: 'Sample Seller 1',
                status: 'in-stock',
                expiryDate: '2026-05-07',
              },
              {
                id: '2',
                name: 'Sample Product 2',
                category: 'General',
                price: 20,
                stock: 0,
                sellerId: '2',
                sellerName: 'Sample Seller 2',
                status: 'out-of-stock',
                expiryDate: '2026-05-07',
              },
            ],
            totalRevenue: 5000,
            revenue: [
              { label: 'Jan', value: 500 },
              { label: 'Feb', value: 600 },
              { label: 'Mar', value: 700 },
              { label: 'Apr', value: 800 },
              { label: 'May', value: 900 },
              { label: 'Jun', value: 0 },
              { label: 'Jul', value: 0 },
              { label: 'Aug', value: 0 },
              { label: 'Sep', value: 0 },
              { label: 'Oct', value: 0 },
              { label: 'Nov', value: 0 },
              { label: 'Dec', value: 0 },
            ],
          };
          set({
            error: `Failed to fetch data after ${retries} attempts: ${err.message}`,
            loading: false,
            stats: fallbackStats,
            users: fallbackStats.recentUsers,
            sellers: fallbackStats.recentSellers,
            products: fallbackStats.recentProducts,
          });
        }
      }
    }
  },

  addUser: async (user) => {
    try {
      const response = await axios.post('/api/users', user);
      console.log('Added user:', response.data);
      set((state) => ({
        users: [...state.users, {
          id: response.data.message._id || Date.now().toString(),
          name: response.data.message.username || 'Unknown',
          email: response.data.message.email || 'N/A',
          role: response.data.message.role || 'user',
          status: (response.data.message.status || 'active').toLowerCase(),
          joinedDate: response.data.message.createdAt ? new Date(response.data.message.createdAt).toISOString().split('T')[0] : 'Unknown',
        }],
        stats: {
          ...state.stats,
          totalUsers: state.stats.totalUsers + 1,
          recentUsers: [
            {
              id: response.data.message._id || Date.now().toString(),
              name: response.data.message.username || 'Unknown',
              email: response.data.message.email || 'N/A',
              status: (response.data.message.status || 'active').toLowerCase(),
              joinedDate: new Date().toISOString().split('T')[0],
            },
            ...state.stats.recentUsers.slice(0, 4),
          ],
        },
      }));
    } catch (err) {
      console.error('Error adding user:', err.message, err.response?.data);
      // Mock response for testing
      const mockUser = {
        _id: Date.now().toString(),
        username: user.name,
        email: user.email,
        role: user.role || 'user',
        status: user.status || 'active',
        createdAt: new Date(),
      };
      set((state) => ({
        users: [...state.users, {
          id: mockUser._id,
          name: mockUser.username,
          email: mockUser.email,
          role: mockUser.role,
          status: mockUser.status.toLowerCase(),
          joinedDate: mockUser.createdAt.toISOString().split('T')[0],
        }],
        stats: {
          ...state.stats,
          totalUsers: state.stats.totalUsers + 1,
          recentUsers: [
            {
              id: mockUser._id,
              name: mockUser.username,
              email: mockUser.email,
              status: mockUser.status.toLowerCase(),
              joinedDate: mockUser.createdAt.toISOString().split('T')[0],
            },
            ...state.stats.recentUsers.slice(0, 4),
          ],
        },
      }));
      console.warn('Using mock user data due to backend failure');
    }
  },

  updateUser: async (id, updatedUser) => {
    try {
      const response = await axios.put(`/api/users/${id}`, updatedUser);
      console.log('Updated user:', response.data);
      set((state) => ({
        users: state.users.map((u) => (u.id === id ? {
          id,
          name: response.data.message.username || 'Unknown',
          email: response.data.message.email || 'N/A',
          role: response.data.message.role || 'user',
          status: (response.data.message.status || 'active').toLowerCase(),
          joinedDate: u.joinedDate,
        } : u)),
        stats: {
          ...state.stats,
          recentUsers: state.stats.recentUsers.map((u) =>
            u.id === id
              ? {
                  id,
                  name: response.data.message.username || 'Unknown',
                  email: response.data.message.email || 'N/A',
                  status: (response.data.message.status || 'active').toLowerCase(),
                  joinedDate: u.joinedDate,
                }
              : u
          ),
        },
      }));
    } catch (err) {
      console.error('Error updating user:', err.message, err.response?.data);
      // Mock update for testing
      set((state) => ({
        users: state.users.map((u) => (u.id === id ? {
          id,
          name: updatedUser.name || u.name,
          email: updatedUser.email || u.email,
          role: updatedUser.role || u.role,
          status: (updatedUser.status || u.status).toLowerCase(),
          joinedDate: u.joinedDate,
        } : u)),
        stats: {
          ...state.stats,
          recentUsers: state.stats.recentUsers.map((u) =>
            u.id === id
              ? {
                  id,
                  name: updatedUser.name || u.name,
                  email: updatedUser.email || u.email,
                  status: (updatedUser.status || u.status).toLowerCase(),
                  joinedDate: u.joinedDate,
                }
              : u
          ),
        },
      }));
      console.warn('Using mock user update due to backend failure');
    }
  },

  deleteUser: async (id) => {
    try {
      await axios.delete(`/api/users/${id}`);
      console.log('Deleted user:', id);
      set((state) => ({
        users: state.users.filter((u) => u.id !== id),
        stats: {
          ...state.stats,
          totalUsers: state.stats.totalUsers - 1,
          recentUsers: state.stats.recentUsers.filter((u) => u.id !== id),
        },
      }));
    } catch (err) {
      console.error('Error deleting user:', err.message, err.response?.data);
      // Mock delete for testing
      set((state) => ({
        users: state.users.filter((u) => u.id !== id),
        stats: {
          ...state.stats,
          totalUsers: state.stats.totalUsers - 1,
          recentUsers: state.stats.recentUsers.filter((u) => u.id !== id),
        },
      }));
      console.warn('Using mock user delete due to backend failure');
    }
  },

  addSeller: async (seller) => {
    try {
      const response = await axios.post('/api/sellers', seller);
      console.log('Added seller:', response.data);
      set((state) => ({
        sellers: [...state.sellers, {
          id: response.data.message._id || Date.now().toString(),
          name: response.data.message.shopName || 'Unknown',
          email: response.data.message.email || 'N/A',
          status: (response.data.message.status || 'active').toLowerCase(),
          totalProducts: 0,
          revenue: 0,
          joinedDate: new Date().toISOString().split('T')[0],
        }],
        stats: {
          ...state.stats,
          totalSellers: state.stats.totalSellers + 1,
          recentSellers: [
            {
              id: response.data.message._id || Date.now().toString(),
              name: response.data.message.shopName || 'Unknown',
              email: response.data.message.email || 'N/A',
              status: (response.data.message.status || 'active').toLowerCase(),
              revenue: 0,
            },
            ...state.stats.recentSellers.slice(0, 4),
          ],
        },
      }));
    } catch (err) {
      console.error('Error adding seller:', err.message, err.response?.data);
      // Mock response for testing
      const mockSeller = {
        _id: Date.now().toString(),
        shopName: seller.name,
        email: seller.email,
        status: seller.status || 'active',
        createdAt: new Date(),
      };
      set((state) => ({
        sellers: [...state.sellers, {
          id: mockSeller._id,
          name: mockSeller.shopName,
          email: mockSeller.email,
          status: mockSeller.status.toLowerCase(),
          totalProducts: 0,
          revenue: 0,
          joinedDate: mockSeller.createdAt.toISOString().split('T')[0],
        }],
        stats: {
          ...state.stats,
          totalSellers: state.stats.totalSellers + 1,
          recentSellers: [
            {
              id: mockSeller._id,
              name: mockSeller.shopName,
              email: mockSeller.email,
              status: mockSeller.status.toLowerCase(),
              revenue: 0,
            },
            ...state.stats.recentSellers.slice(0, 4),
          ],
        },
      }));
      console.warn('Using mock seller data due to backend failure');
    }
  },

  updateSeller: async (id, updatedSeller) => {
    try {
      const response = await axios.put(`/api/sellers/${id}`, updatedSeller);
      console.log('Updated seller:', response.data);
      set((state) => ({
        sellers: state.sellers.map((s) => (s.id === id ? {
          id,
          name: response.data.message.shopName || 'Unknown',
          email: response.data.message.email || 'N/A',
          status: (response.data.message.status || 'active').toLowerCase(),
          totalProducts: s.totalProducts,
          revenue: s.revenue,
          joinedDate: s.joinedDate,
        } : s)),
        stats: {
          ...state.stats,
          recentSellers: state.stats.recentSellers.map((s) =>
            s.id === id
              ? {
                  id,
                  name: response.data.message.shopName || 'Unknown',
                  email: response.data.message.email || 'N/A',
                  status: (response.data.message.status || 'active').toLowerCase(),
                  revenue: s.revenue,
                }
              : s
          ),
        },
      }));
    } catch (err) {
      console.error('Error updating seller:', err.message, err.response?.data);
      // Mock update for testing
      set((state) => ({
        sellers: state.sellers.map((s) => (s.id === id ? {
          id,
          name: updatedSeller.name || s.name,
          email: updatedSeller.email || s.email,
          status: (updatedSeller.status || s.status).toLowerCase(),
          totalProducts: s.totalProducts,
          revenue: s.revenue,
          joinedDate: s.joinedDate,
        } : s)),
        stats: {
          ...state.stats,
          recentSellers: state.stats.recentSellers.map((s) =>
            s.id === id
              ? {
                  id,
                  name: updatedSeller.name || s.name,
                  email: updatedSeller.email || s.email,
                  status: (updatedSeller.status || s.status).toLowerCase(),
                  revenue: s.revenue,
                }
              : s
          ),
        },
      }));
      console.warn('Using mock seller update due to backend failure');
    }
  },

  deleteSeller: async (id) => {
    try {
      await axios.delete(`/api/sellers/${id}`);
      console.log('Deleted seller:', id);
      set((state) => ({
        sellers: state.sellers.filter((s) => s.id !== id),
        stats: {
          ...state.stats,
          totalSellers: state.stats.totalSellers - 1,
          recentSellers: state.stats.recentSellers.filter((s) => s.id !== id),
        },
      }));
    } catch (err) {
      console.error('Error deleting seller:', err.message, err.response?.data);
      // Mock delete for testing
      set((state) => ({
        sellers: state.sellers.filter((s) => s.id !== id),
        stats: {
          ...state.stats,
          totalSellers: state.stats.totalSellers - 1,
          recentSellers: state.stats.recentSellers.filter((s) => s.id !== id),
        },
      }));
      console.warn('Using mock seller delete due to backend failure');
    }
  },

  addProduct: async (product) => {
    try {
      const response = await axios.post('/api/medicine', product);
      console.log('Added product:', response.data);
      set((state) => {
        const newProduct = {
          id: response.data.message._id || Date.now().toString(),
          name: response.data.message.name || 'Unknown',
          category: response.data.message.category || 'Unknown',
          price: response.data.message.price || 0,
          stock: response.data.message.count || 0,
          sellerId: response.data.message.sellerId || product.sellerId || 'Unknown',
          sellerName: response.data.message.seller || state.sellers.find((s) => s.id === product.sellerId)?.name || 'Unknown',
          status: (response.data.message.count > 10 ? 'in-stock' : response.data.message.count > 0 ? 'low-stock' : 'out-of-stock').toLowerCase(),
          expiryDate: response.data.message.expiryDate ? new Date(response.data.message.expiryDate).toISOString().split('T')[0] : 'Unknown',
        };
        return {
          products: [...state.products, newProduct],
          stats: {
            ...state.stats,
            totalProducts: state.stats.totalProducts + 1,
            recentProducts: [
              newProduct,
              ...state.stats.recentProducts.slice(0, 4),
            ],
          },
        };
      });
    } catch (err) {
      console.error('Error adding product:', err.message, err.response?.data);
      // Mock response for testing
      const mockProduct = {
        _id: Date.now().toString(),
        name: product.name,
        category: product.category,
        price: product.price || 0,
        count: product.stock || 0,
        sellerId: product.sellerId,
        seller: state.sellers.find((s) => s.id === product.sellerId)?.name || 'Unknown',
        expiryDate: product.expiryDate,
      };
      set((state) => {
        const newProduct = {
          id: mockProduct._id,
          name: mockProduct.name,
          category: mockProduct.category,
          price: mockProduct.price,
          stock: mockProduct.count,
          sellerId: mockProduct.sellerId,
          sellerName: mockProduct.seller,
          status: (mockProduct.count > 10 ? 'in-stock' : mockProduct.count > 0 ? 'low-stock' : 'out-of-stock').toLowerCase(),
          expiryDate: mockProduct.expiryDate ? new Date(mockProduct.expiryDate).toISOString().split('T')[0] : 'Unknown',
        };
        return {
          products: [...state.products, newProduct],
          stats: {
            ...state.stats,
            totalProducts: state.stats.totalProducts + 1,
            recentProducts: [
              newProduct,
              ...state.stats.recentProducts.slice(0, 4),
            ],
          },
        };
      });
      console.warn('Using mock product data due to backend failure');
    }
  },

  updateProduct: async (id, updatedProduct) => {
    try {
      const response = await axios.put(`/api/medicine/${id}`, updatedProduct);
      console.log('Updated product:', response.data);
      set((state) => ({
        products: state.products.map((p) => (p.id === id ? {
          id,
          name: response.data.message.name || 'Unknown',
          category: response.data.message.category || 'Unknown',
          price: response.data.message.price || 0,
          stock: response.data.message.count || 0,
          sellerId: response.data.message.sellerId || updatedProduct.sellerId || 'Unknown',
          sellerName: response.data.message.seller || state.sellers.find((s) => s.id === updatedProduct.sellerId)?.name || 'Unknown',
          status: (response.data.message.count > 10 ? 'in-stock' : response.data.message.count > 0 ? 'low-stock' : 'out-of-stock').toLowerCase(),
          expiryDate: response.data.message.expiryDate ? new Date(response.data.message.expiryDate).toISOString().split('T')[0] : 'Unknown',
        } : p)),
        stats: {
          ...state.stats,
          recentProducts: state.stats.recentProducts.map((p) =>
            p.id === id
              ? {
                  id,
                  name: response.data.message.name || 'Unknown',
                  category: response.data.message.category || 'Unknown',
                  price: response.data.message.price || 0,
                  stock: response.data.message.count || 0,
                  sellerId: response.data.message.sellerId || updatedProduct.sellerId || 'Unknown',
                  sellerName: response.data.message.seller || state.sellers.find((s) => s.id === updatedProduct.sellerId)?.name || 'Unknown',
                  status: (response.data.message.count > 10 ? 'in-stock' : response.data.message.count > 0 ? 'low-stock' : 'out-of-stock').toLowerCase(),
                  expiryDate: response.data.message.expiryDate ? new Date(response.data.message.expiryDate).toISOString().split('T')[0] : 'Unknown',
                }
              : p
          ),
        },
      }));
    } catch (err) {
      console.error('Error updating product:', err.message, err.response?.data);
      // Mock update for testing
      set((state) => ({
        products: state.products.map((p) => (p.id === id ? {
          id,
          name: updatedProduct.name || p.name,
          category: updatedProduct.category || p.category,
          price: updatedProduct.price || p.price,
          stock: updatedProduct.stock || p.stock,
          sellerId: updatedProduct.sellerId || p.sellerId,
          sellerName: state.sellers.find((s) => s.id === updatedProduct.sellerId)?.name || p.sellerName,
          status: (updatedProduct.stock > 10 ? 'in-stock' : updatedProduct.stock > 0 ? 'low-stock' : 'out-of-stock').toLowerCase(),
          expiryDate: updatedProduct.expiryDate ? new Date(updatedProduct.expiryDate).toISOString().split('T')[0] : p.expiryDate,
        } : p)),
        stats: {
          ...state.stats,
          recentProducts: state.stats.recentProducts.map((p) =>
            p.id === id
              ? {
                  id,
                  name: updatedProduct.name || p.name,
                  category: updatedProduct.category || p.category,
                  price: updatedProduct.price || p.price,
                  stock: updatedProduct.stock || p.stock,
                  sellerId: updatedProduct.sellerId || p.sellerId,
                  sellerName: state.sellers.find((s) => s.id === updatedProduct.sellerId)?.name || p.sellerName,
                  status: (updatedProduct.stock > 10 ? 'in-stock' : updatedProduct.stock > 0 ? 'low-stock' : 'out-of-stock').toLowerCase(),
                  expiryDate: updatedProduct.expiryDate ? new Date(updatedProduct.expiryDate).toISOString().split('T')[0] : p.expiryDate,
                }
              : p
          ),
        },
      }));
      console.warn('Using mock product update due to backend failure');
    }
  },

  deleteProduct: async (id) => {
    try {
      await axios.delete(`/api/medicine/${id}`);
      console.log('Deleted product:', id);
      set((state) => ({
        products: state.products.filter((p) => p.id !== id),
        stats: {
          ...state.stats,
          totalProducts: state.stats.totalProducts - 1,
          recentProducts: state.stats.recentProducts.filter((p) => p.id !== id),
        },
      }));
    } catch (err) {
      console.error('Error deleting product:', err.message, err.response?.data);
      // Mock delete for testing
      set((state) => ({
        products: state.products.filter((p) => p.id !== id),
        stats: {
          ...state.stats,
          totalProducts: state.stats.totalProducts - 1,
          recentProducts: state.stats.recentProducts.filter((p) => p.id !== id),
        },
      }));
      console.warn('Using mock product delete due to backend failure');
    }
  },
}));

useStore.getState().fetchStats();

export { useStore };