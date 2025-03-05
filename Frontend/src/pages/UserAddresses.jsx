import React from 'react';
import { Home, Building2, Plus, Pencil, Trash2 } from 'lucide-react';

const mockAddresses = [
  {
    id: 1,
    type: 'Home',
    name: 'John Doe',
    address: '123 Main Street',
    city: 'New York',
    state: 'NY',
    zip: '10001',
    phone: '+1 (555) 123-4567',
    isDefault: true
  },
  {
    id: 2,
    type: 'Office',
    name: 'John Doe',
    address: '456 Business Ave',
    city: 'New York',
    state: 'NY',
    zip: '10002',
    phone: '+1 (555) 987-6543',
    isDefault: false
  }
];

function UserAddresses() {
  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">My Addresses</h1>
          <p className="text-gray-600">Manage your delivery addresses</p>
        </div>
        <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          <Plus className="w-5 h-5 mr-2" />
          Add New Address
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {mockAddresses.map((address) => (
          <div key={address.id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center">
                {address.type === 'Home' ? (
                  <Home className="w-5 h-5 text-blue-600" />
                ) : (
                  <Building2 className="w-5 h-5 text-blue-600" />
                )}
                <span className="ml-2 font-semibold text-gray-800">{address.type}</span>
                {address.isDefault && (
                  <span className="ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-600 rounded-full">
                    Default
                  </span>
                )}
              </div>
              <div className="flex space-x-2">
                <button className="p-2 text-gray-600 hover:text-blue-600 rounded-full hover:bg-blue-50">
                  <Pencil className="w-4 h-4" />
                </button>
                <button className="p-2 text-gray-600 hover:text-red-600 rounded-full hover:bg-red-50">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="space-y-2 text-gray-600">
              <p className="font-medium text-gray-800">{address.name}</p>
              <p>{address.address}</p>
              <p>{`${address.city}, ${address.state} ${address.zip}`}</p>
              <p>{address.phone}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default UserAddresses;