import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import Table from '../components/ui/Table';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import SellerForm from '../components/forms/SellerForm';
import Badge from '../components/ui/Badge';
import { Seller } from '../types';

const Sellers = ({ 
  sellers, 
  onAdd, 
  onUpdate, 
  onDelete 
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentSeller, setCurrentSeller] = useState(undefined);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [sellerToDelete, setSellerToDelete] = useState(null);
  
  const columns = [
    { header: 'Name', accessor: 'name' },
    { header: 'Email', accessor: 'email' },
    { 
      header: 'Status', 
      accessor: 'status',
      cell: (row) => <Badge status={row.status} type="seller" />
    },
    { 
      header: 'Products', 
      accessor: 'totalProducts',
      cell: (row) => row.totalProducts
    },
    { 
      header: 'Revenue', 
      accessor: 'revenue',
      cell: (row) => `${row.revenue.toLocaleString()}`
    },
  ];
  
  const handleEdit = (seller) => {
    setCurrentSeller(seller);
    setIsModalOpen(true);
  };
  
  const handleDelete = (seller) => {
    setSellerToDelete(seller);
    setIsDeleteModalOpen(true);
  };
  
  const confirmDelete = () => {
    if (sellerToDelete) {
      onDelete(sellerToDelete.id);
      setIsDeleteModalOpen(false);
      setSellerToDelete(null);
    }
  };
  
  const handleFormSubmit = (sellerData) => {
    if (sellerData.id) {
      // Keep existing fields that weren't in the form
      const existingSeller = sellers.find(s => s.id === sellerData.id);
      if (existingSeller) {
        const updatedSeller = {
          ...sellerData,
          joinedDate: existingSeller.joinedDate,
          totalProducts: existingSeller.totalProducts,
          revenue: existingSeller.revenue,
        };
        onUpdate(updatedSeller);
      }
    } else {
      onAdd(sellerData);
    }
    setIsModalOpen(false);
    setCurrentSeller(undefined);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Sellers</h2>
          <p className="mt-1 text-sm text-gray-600">
            Manage pharmacy partners who sell medicine products
          </p>
        </div>
        
        <Button 
          onClick={() => {
            setCurrentSeller(undefined);
            setIsModalOpen(true);
          }}
        >
          <Plus size={16} className="mr-2" />
          Add Seller
        </Button>
      </div>
      
      <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
        <Table
          columns={columns}
          data={sellers}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>
      
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={currentSeller ? 'Edit Seller' : 'Add New Seller'}
      >
        <SellerForm
          seller={currentSeller}
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
            Are you sure you want to delete the seller '{sellerToDelete?.name}'? 
            This will also remove all products associated with this seller and cannot be undone.
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

export default Sellers;