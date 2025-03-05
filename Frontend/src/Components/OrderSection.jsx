import React from 'react';
import OrderCard from './OrderCard';
import { Link } from 'react-router-dom'

const OrdersSection = ({ orders }) => {
  return (
    <section className="container mx-auto px-4 py-16">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold">Your Last Orders</h2>
        
        <Link to='/userDashboard/orders'><button className="text-blue-600 hover:text-blue-700">View All Orders</button></Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {orders.map((order) => (
          <OrderCard key={order._id} order={order} />
        ))}
      </div>
    </section>
  );
};

export default OrdersSection;