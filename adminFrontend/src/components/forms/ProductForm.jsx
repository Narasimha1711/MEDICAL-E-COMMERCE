import React, { useState, useEffect } from 'react';
import Button from '../ui/Button';
import { Seller } from '../../types';

const ProductForm = ({ product, sellers, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: 0,
    stock: 0,
    sellerId: '',
    expiryDate: '',
  });
  
  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        category: product.category || '',
        price: product.price || 0,
        stock: product.stock || 0,
        sellerId: product.sellerId || '',
        expiryDate: product.expiryDate || '',
      });
    } else if (sellers.length > 0) {
      setFormData(prev => ({
        ...prev,
        sellerId: sellers[0].id,
      }));
    }
  }, [product, sellers]);
  
  const handleChange = (e) => {
    const { name, value, type } = e.target;
    
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'number' ? parseFloat(value) : value
    }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      id: product?.id,
    });
  };
  
  const categories = [
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
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Product Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-violet-500 focus:outline-none focus:ring-violet-500 sm:text-sm"
        />
      </div>
      
      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700">
          Category
        </label>
        <select
          id="category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-violet-500 focus:outline-none focus:ring-violet-500 sm:text-sm"
        >
          <option value="">Select category</option>
          {categories.map(category => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>
      
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-700">
            Price ($)
          </label>
          <input
            type="number"
            id="price"
            name="price"
            min="0"
            step="0.01"
            value={formData.price}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-violet-500 focus:outline-none focus:ring-violet-500 sm:text-sm"
          />
        </div>
        
        <div>
          <label htmlFor="stock" className="block text-sm font-medium text-gray-700">
            Stock
          </label>
          <input
            type="number"
            id="stock"
            name="stock"
            min="0"
            value={formData.stock}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-violet-500 focus:outline-none focus:ring-violet-500 sm:text-sm"
          />
        </div>
      </div>
      
      <div>
        <label htmlFor="sellerId" className="block text-sm font-medium text-gray-700">
          Seller
        </label>
        <select
          id="sellerId"
          name="sellerId"
          value={formData.sellerId}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-violet-500 focus:outline-none focus:ring-violet-500 sm:text-sm"
        >
          <option value="">Select seller</option>
          {sellers.map(seller => (
            <option key={seller.id} value={seller.id}>
              {seller.name}
            </option>
          ))}
        </select>
      </div>
      
      <div>
        <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700">
          Expiry Date
        </label>
        <input
          type="date"
          id="expiryDate"
          name="expiryDate"
          value={formData.expiryDate}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-violet-500 focus:outline-none focus:ring-violet-500 sm:text-sm"
        />
      </div>
      
      <div className="flex justify-end space-x-3 pt-4">
        <Button 
          variant="secondary" 
          onClick={onCancel}
          type="button"
        >
          Cancel
        </Button>
        <Button type="submit">
          {product?.id ? 'Update' : 'Create'} Product
        </Button>
      </div>
    </form>
  );
};

export default ProductForm;