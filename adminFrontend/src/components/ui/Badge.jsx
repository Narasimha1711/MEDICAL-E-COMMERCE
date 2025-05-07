import React from 'react';

const Badge = ({ status, type = 'user' }) => {
  // Log status for debugging
  console.log('Badge rendering:', { status, type, normalized: (status || 'unknown').toLowerCase() });
  
  // Fallback for undefined or null status and normalize to lowercase
  const displayStatus = (status || 'unknown').toLowerCase();
  
  let colorClass = '';
  
  if (type === 'user' || type === 'seller') {
    switch (displayStatus) {
      case 'active':
        colorClass = 'bg-green-100 text-green-800';
        break;
      case 'inactive':
      case 'suspended':
        colorClass = 'bg-red-100 text-red-800';
        break;
      case 'pending':
        colorClass = 'bg-yellow-100 text-yellow-800';
        break;
      default:
        colorClass = 'bg-gray-100 text-gray-800';
        console.warn(`Unknown ${type} status: ${displayStatus}`);
    }
  } else if (type === 'product') {
    switch (displayStatus) {
      case 'in-stock':
        colorClass = 'bg-green-100 text-green-800';
        break;
      case 'low-stock':
        colorClass = 'bg-yellow-100 text-yellow-800';
        break;
      case 'out-of-stock':
        colorClass = 'bg-red-100 text-red-800';
        break;
      default:
        colorClass = 'bg-gray-100 text-gray-800';
        console.warn(`Unknown product status: ${displayStatus}`);
    }
  }
  
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${colorClass}`}>
      {displayStatus.replace(/-/g, ' ')}
    </span>
  );
};

export default Badge;