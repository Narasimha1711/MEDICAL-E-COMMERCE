/* eslint-disable no-unused-vars */


import React, { useEffect, useState } from 'react';
import { Search, ArrowUpDown, Package2 } from 'lucide-react';
import axios from 'axios';
import SellerSidebar from '../Components/SellerSidebar';

const initialUserColumns = [
  { field: 'image', headerName: 'Image' },
  { field: 'medicine', headerName: 'Medicine Name' },
  { field: 'price', headerName: 'Price' },
  { field: 'count', headerName: 'Quantity' },
];

export default function YourInventory() {
  const [rows, setRows] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState(null);

  useEffect(() => {
    const fetchInventory = async () => {
      const response = await axios.get('/inventory');
      setRows(response.data);
    };
    fetchInventory();
  }, []);

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig?.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });

    const sortedRows = [...rows].sort((a, b) => {
      if (a[key] < b[key]) return direction === 'ascending' ? -1 : 1;
      if (a[key] > b[key]) return direction === 'ascending' ? 1 : -1;
      return 0;
    });
    setRows(sortedRows);
  };

  const filteredRows = rows.filter(row =>
    row.medicine.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex">
      <SellerSidebar />
      <div className="flex-1 ml-[280px] min-h-screen bg-gray-50">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white shadow-sm">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Package2 className="h-6 w-6 text-indigo-600" />
                <h1 className="text-xl font-semibold text-gray-900">Your Inventory</h1>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search medicines..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-6">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-100">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {initialUserColumns.map((column) => (
                      <th
                        key={column.field}
                        onClick={() => requestSort(column.field)}
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex items-center space-x-1">
                          <span>{column.headerName}</span>
                          <ArrowUpDown className="h-4 w-4" />
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredRows.map((row, index) => (
                    <tr key={index} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <img
                          src={`${import.meta.env.VITE_API_BASE_URL}/uploads/${row.image}`}
                          alt={row.medicine}
                          className="h-16 w-16 object-cover rounded-lg shadow-sm"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{row.medicine}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">₹{row.price}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          row.count > 5 
                            ? 'bg-green-100 text-green-800'
                            : row.count == 5
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {row.count}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {filteredRows.length === 0 && (
            <div className="text-center py-12 bg-white mt-6 rounded-lg shadow-lg border border-gray-100">
              <Package2 className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No items found</h3>
              <p className="mt-1 text-sm text-gray-500">
                Try adjusting your search terms or check back later for new inventory.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}