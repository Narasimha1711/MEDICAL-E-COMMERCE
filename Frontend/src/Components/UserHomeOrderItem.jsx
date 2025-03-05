import React from 'react';

const UserHomeOrderItem = ({ item }) => {
  const { name, price } = item;
  
  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center">
        <div className="ml-4">
          <p className="font-medium">{name}</p>
        </div>
      </div>
      <p className="font-medium">₹{price.toFixed(2)}</p>
    </div>
  );
};

export default UserHomeOrderItem;