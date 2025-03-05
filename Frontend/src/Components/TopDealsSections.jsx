import React from 'react';
import { FaArrowRight } from 'react-icons/fa';
import ProductCard from '../Components/ProductCard';


// const TopDealsSection = ({ products, userLocation, addToCart, distance }) => {
const TopDealsSection = ({ products }) => {
  return (
    <section className="container mx-auto px-4 py-16">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold">Top Deals</h2>
        <button className="flex items-center gap-2 text-blue-600 hover:text-blue-700">
          View All <FaArrowRight />
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map((product) => (
          <ProductCard
            key={product._id}
            product={product}
            // userLocation={userLocation}
            // addToCart={addToCart}
            // distance={distance}
          />
        ))}
      </div>
    </section>
  );
};

export default TopDealsSection;