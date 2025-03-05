import React from 'react';
import { Calendar, Package } from 'lucide-react';
// import OrderStatus from './OrderStatus';
// import OrderTotal from './OrderTotal';
import UserHomeOrderItem from './UserHomeOrderItem';



const UserHomeOrderCard = ({ order }) => {
  

  // const { orderId, status, items, totalAmount, expectedDelivery, orderDate } = order;
  const { orderId, deliveryDate, status, products, totalAmount } = order;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Order #{orderId}</h3>
        <OrderStatus status={status} />
      </div>
      
      <div className="flex items-center text-gray-600 mb-4">
        <Calendar className="w-4 h-4 mr-2" />
        <span>{new Date(deliveryDate).toLocaleDateString()}</span>
        <Package className="w-4 h-4 ml-4 mr-2" />
        <span>{products.length} items</span>
      </div>
      
      <div className="space-y-3">
        {products.map((item, index) => (
          <UserHomeOrderItem key={index} item={item} />
        ))}
      </div>
      
      {/* <OrderTotal amount={totalAmount} /> */}
      <div className="mt-4 pt-4 border-t">
      <div className="flex justify-between items-center">
        <span className="font-semibold">Total</span>
        <span className="font-semibold">₹{totalAmount.toFixed(2)}</span>
      </div>
    </div>
    </div>
  );
};

export default UserHomeOrderCard;