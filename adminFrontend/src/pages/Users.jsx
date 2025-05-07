import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import Table from '../components/ui/Table';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import UserForm from '../components/forms/UserForm';
import Badge from '../components/ui/Badge';
import { User } from '../types';

const Users = ({ 
  users, 
  onAdd, 
  onUpdate, 
  onDelete 
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(undefined);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  
  const columns = [
    { header: 'Name', accessor: 'name' },
    { header: 'Email', accessor: 'email' },
    { header: 'Role', accessor: 'role' },
    { 
      header: 'Status', 
      accessor: 'status',
      cell: (row) => <Badge status={row.status} type="user" />
    },
    { header: 'Joined Date', accessor: 'joinedDate' },
  ];
  
  const handleEdit = (user) => {
    setCurrentUser(user);
    setIsModalOpen(true);
  };
  
  const handleDelete = (user) => {
    setUserToDelete(user);
    setIsDeleteModalOpen(true);
  };
  
  const confirmDelete = () => {
    if (userToDelete) {
      onDelete(userToDelete.id);
      setIsDeleteModalOpen(false);
      setUserToDelete(null);
    }
  };
  
  const handleFormSubmit = (userData) => {
    if (userData.id) {
      onUpdate(userData);
    } else {
      onAdd(userData);
    }
    setIsModalOpen(false);
    setCurrentUser(undefined);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Users</h2>
          <p className="mt-1 text-sm text-gray-600">
            Manage all users of the medical platform
          </p>
        </div>
        
        <Button 
          onClick={() => {
            setCurrentUser(undefined);
            setIsModalOpen(true);
          }}
        >
          <Plus size={16} className="mr-2" />
          Add User
        </Button>
      </div>
      
      <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
        <Table
          columns={columns}
          data={users}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>
      
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={currentUser ? 'Edit User' : 'Add New User'}
      >
        <UserForm
          user={currentUser}
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
            Are you sure you want to delete the user '{userToDelete?.name}'? This action cannot be undone.
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

export default Users;