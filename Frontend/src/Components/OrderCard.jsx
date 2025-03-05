import React from 'react';
import { Calendar, Package } from 'lucide-react';

const OrderCard = ({ order }) => {
  // const { id, date, status, items, total } = order;
  const { orderId, deliveryDate, status, products, totalAmount } = order;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Order #{orderId}</h3>
        <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(status)}`}>
          {/* {status} */}
        </span>
      </div>
      <div className="flex items-center text-gray-600 mb-4">
        <Calendar className="w-4 h-4 mr-2" />
        <span>{new Date(deliveryDate).toLocaleDateString()}</span>
        <Package className="w-4 h-4 ml-4 mr-2" />
        <span>{products.length} items</span>
      </div>
      <div className="space-y-3">
        {products.map((item, index) => (
          <div key={index} className="flex justify-between items-center">
            <div className="flex items-center">
              {/* <img src={item.image} alt={item.name} className="w-12 h-12 rounded object-cover" /> */}
              <div className="ml-4">
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-gray-500">Qty: {item.count}</p>
              </div>
            </div>
            <p className="font-medium">₹{item.discountedPrice.toFixed(2)}</p>
          </div>
        ))}
      </div>
      <div className="mt-4 pt-4 border-t">
        <div className="flex justify-between items-center">
          <span className="font-semibold">Total</span>
          <span className="font-semibold">₹{totalAmount.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

const getStatusColor = (status) => {
  const colors = {
    'Delivered': 'bg-green-100 text-green-800',
    'In Transit': 'bg-blue-100 text-blue-800',
    'Processing': 'bg-yellow-100 text-yellow-800',
    'Cancelled': 'bg-red-100 text-red-800'
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
};

export default OrderCard;