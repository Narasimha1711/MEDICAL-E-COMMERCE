import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import Table from '../components/ui/Table';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import ProductForm from '../components/forms/ProductForm';
import Badge from '../components/ui/Badge';

const Products = ({ 
  products, 
  sellers,
  onAdd, 
  onUpdate, 
  onDelete 
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(undefined);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  
  const columns = [
    { header: 'Name', accessor: 'name' },
    { header: 'Category', accessor: 'category' },
    { 
      header: 'Price', 
      accessor: 'price',
      cell: (row) => `${row.price.toLocaleString()}`
    },
    { 
      header: 'Stock', 
      accessor: 'stock'
    },
    { 
      header: 'Status', 
      accessor: 'status',
      cell: (row) => <Badge status={row.status} type="product" />
    },
    { header: 'Seller', accessor: 'sellerName' },
    { 
      header: 'Expiry Date', 
      accessor: 'expiryDate',
      cell: (row) => {
        const today = new Date();
        const expiryDate = new Date(row.expiryDate);
        const isExpiring = expiryDate <= new Date(today.setMonth(today.getMonth() + 3));
        
        return (
          <span className={isExpiring ? 'text-red-600 font-medium' : ''}>
            {row.expiryDate}
          </span>
        );
      }
    },
  ];
  
  const handleEdit = (product) => {
    setCurrentProduct(product);
    setIsModalOpen(true);
  };
  
  const handleDelete = (product) => {
    setProductToDelete(product);
    setIsDeleteModalOpen(true);
  };
  
  const confirmDelete = () => {
    if (productToDelete) {
      onDelete(productToDelete.id);
      setIsDeleteModalOpen(false);
      setProductToDelete(null);
    }
  };
  
  const handleFormSubmit = (productData) => {
    if (productData.id) {
      // Keep existing fields that weren't in the form
      const existingProduct = products.find(p => p.id === productData.id);
      const seller = sellers.find(s => s.id === productData.sellerId);
      
      if (existingProduct && seller) {
        const status = determineStatus(productData.stock);
        
        const updatedProduct = {
          ...productData,
          sellerName: seller.name,
          sellerId: seller.id,
          status,
        };
        
        onUpdate(updatedProduct);
      }
    } else {
      // Get the seller name
      const seller = sellers.find(s => s.id === productData.sellerId);
      
      if (seller) {
        const status = determineStatus(productData.stock);
        
        const newProduct = {
          ...productData,
          sellerName: seller.name,
          sellerId: seller.id,
          status,
        };
        
        onAdd(newProduct);
      }
    }
    
    setIsModalOpen(false);
    setCurrentProduct(undefined);
  };
  
  const determineStatus = (stock) => {
    if (stock === 0) {
      return 'out-of-stock';
    } else if (stock < 10) {
      return 'low-stock';
    }
    return 'in-stock';
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Products</h2>
          <p className="mt-1 text-sm text-gray-600">
            Manage all medicine products in the inventory
          </p>
        </div>
        
        <Button 
          onClick={() => {
            setCurrentProduct(undefined);
            setIsModalOpen(true);
          }}
        >
          <Plus size={16} className="mr-2" />
          Add Product
        </Button>
      </div>
      
      <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
        <Table
          columns={columns}
          data={products}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>
      
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={currentProduct ? 'Edit Product' : 'Add New Product'}
      >
        <ProductForm
          product={currentProduct}
          sellers={sellers}
          onSubmit={handleFormSubmit}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
      
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirm Delete"
      >
        <div className="space-y-4">
          <p>
            Are you sure you want to delete the product '{productToDelete?.name}'? This action cannot be undone.
          </p>
          
          <div className="flex justify-end space-x-3">
            <Button 
              variant="secondary"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              variant="danger"
              onClick={confirmDelete}
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Products;