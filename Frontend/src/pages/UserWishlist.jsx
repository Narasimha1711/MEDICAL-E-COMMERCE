import React from 'react';
import { Heart, ShoppingCart, Trash2 } from 'lucide-react';

const mockWishlist = [
  {
    id: 1,
    name: "Premium Headphones",
    price: 199.99,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200",
    inStock: true
  },
  {
    id: 2,
    name: "Smartwatch Pro",
    price: 299.99,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200",
    inStock: false
  }
];

function UserWishlist() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">My Wishlist</h1>
        <p className="text-gray-600">Items you've saved for later</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockWishlist.map((item) => (
          <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="relative">
              <img src={item.image} alt={item.name} className="w-full h-48 object-cover" />
              <button className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-100">
                <Heart className="w-5 h-5 text-red-500 fill-current" />
              </button>
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
              <p className="text-gray-600 mt-1">${item.price.toFixed(2)}</p>
              <div className="mt-4 flex justify-between items-center">
                <span className={`text-sm ${item.inStock ? 'text-green-600' : 'text-red-600'}`}>
                  {item.inStock ? 'In Stock' : 'Out of Stock'}
                </span>
                <div className="space-x-2">
                  <button 
                    className={`p-2 rounded-full ${
                      item.inStock 
                        ? 'bg-blue-50 text-blue-600 hover:bg-blue-100' 
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                    disabled={!item.inStock}
                  >
                    <ShoppingCart className="w-5 h-5" />
                  </button>
                  <button className="p-2 rounded-full bg-red-50 text-red-600 hover:bg-red-100">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default UserWishlist;