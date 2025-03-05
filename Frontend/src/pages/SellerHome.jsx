/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState, useEffect } from "react";
import axios from "axios";
import { formatDistanceToNow } from "date-fns";
import SellerSidebar from "../Components/SellerSidebar";
import {
  Bell,
  Settings,
  DollarSign,
  Package,
  AlertTriangle,
  ShoppingCart,
  Trash2,
  Edit2,
  Save,
  X,
} from "lucide-react";

// Configure axios defaults
axios.defaults.withCredentials = true;

// API functions
async function fetchInventory() {
  try {
    const response = await axios.get("/inventory");
    return response.data.map((medicine) => ({
      id: medicine._id,
      name: medicine.medicine,
      price: medicine.price,
      count: medicine.count,
      initialCount: medicine.count,
      uploadedAt: new Date().toISOString(),
      description: medicine.description,
      category: medicine.category,
    }));
  } catch (error) {
    throw new Error("Failed to fetch inventory");
  }
}

async function deleteMedicine(id) {
  try {
    await axios.delete(`/inventory/${id}`);
  } catch (error) {
    throw new Error("Failed to delete medicine");
  }
}

async function updateMedicineCount(id, count) {
  try {
    await axios.post("/updateCount", { id, count });
  } catch (error) {
    throw new Error("Failed to update medicine count");
  }
}

// Stat Card Component
function StatCard({ title, value, icon: Icon, className = "", tooltip }) {
  return (
    <div className="relative group">
      <div
        className={`bg-white rounded-xl shadow-sm p-6 transition-all duration-200 hover:shadow-md ${className}`}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-semibold mt-2">{value}</p>
          </div>
          <div className="p-3 bg-blue-50 rounded-lg">
            <Icon className="w-6 h-6 text-blue-600" />
          </div>
        </div>
      </div>
      {tooltip && (
        <div className="absolute z-10 w-72 p-4 bg-white rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 -translate-y-2 group-hover:translate-y-0 pointer-events-none top-full left-0 mt-2">
          {tooltip}
        </div>
      )}
    </div>
  );
}

// Low Stock List Component
function LowStockList({ items }) {
  return (
    <div className="space-y-2">
      <p className="font-medium text-gray-700 mb-3">Low Stock Items:</p>
      {items.map((item) => (
        <div
          key={item.id}
          className="flex justify-between items-center text-sm"
        >
          <span className="text-gray-700">{item.name}</span>
          <span className="text-red-500 font-medium">{item.count} left</span>
        </div>
      ))}
    </div>
  );
}

// Stats Grid Component
function StatsGrid({
  totalRevenue,
  totalSales,
  medicinesCount,
  lowStockItems,
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <StatCard
        title="Amount Invested"
        value={`₹${totalRevenue.toFixed(2)}`}
        icon={DollarSign}
        className="bg-green-50"
      />
      <StatCard
        title="Stock of Medicines"
        value={`${totalSales} Units`}
        icon={ShoppingCart}
        className="bg-blue-50"
      />
      <StatCard
        title="Total Medicines"
        value={medicinesCount}
        icon={Package}
        className="bg-purple-50"
      />
      <StatCard
        title="Low Stock Items"
        value={lowStockItems.length}
        icon={AlertTriangle}
        className="bg-red-50"
        tooltip={<LowStockList items={lowStockItems} />}
      />
    </div>
  );
}

// Medicines Table Component
function MedicinesTable({
  medicines,
  sortField,
  sortDirection,
  onSort,
  onDelete,
  onUpdateCount,
}) {
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState("");

  const handleEdit = (medicine) => {
    setEditingId(medicine.id);
    setEditValue(medicine.count.toString());
  };

  const handleSave = async (id) => {
    await onUpdateCount(id, editValue);
    setEditingId(null);
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditValue("");
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => onSort("name")}
            >
              Name{" "}
              {sortField === "name" && (sortDirection === "asc" ? "↑" : "↓")}
            </th>
            <th
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => onSort("price")}
            >
              Price{" "}
              {sortField === "price" && (sortDirection === "asc" ? "↑" : "↓")}
            </th>
            <th
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => onSort("count")}
            >
              Stock{" "}
              {sortField === "count" && (sortDirection === "asc" ? "↑" : "↓")}
            </th>
            <th
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => onSort("uploadedAt")}
            >
              Last Updated{" "}
              {sortField === "uploadedAt" &&
                (sortDirection === "asc" ? "↑" : "↓")}
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {medicines.map((medicine) => (
            <tr
              key={medicine.id}
              className={medicine.count < 5 ? "bg-red-50" : ""}
            >
              <td className="px-6 py-4 whitespace-nowrap">{medicine.name}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                ${medicine.price.toFixed(2)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {editingId === medicine.id ? (
                  <input
                    type="number"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    className="w-20 px-2 py-1 border rounded"
                    min="0"
                  />
                ) : (
                  <span
                    className={`${
                      medicine.count < 5 ? "text-red-600 font-medium" : ""
                    }`}
                  >
                    {medicine.count}
                  </span>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {formatDistanceToNow(new Date(medicine.uploadedAt))} ago
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                {editingId === medicine.id ? (
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => handleSave(medicine.id)}
                      className="text-green-600 hover:text-green-900"
                    >
                      <Save className="w-5 h-5" />
                    </button>
                    <button
                      onClick={handleCancel}
                      className="text-gray-600 hover:text-gray-900"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                ) : (
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => handleEdit(medicine)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <Edit2 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => onDelete(medicine.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Main App Component
function App() {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortField, setSortField] = useState("name");
  const [sortDirection, setSortDirection] = useState("asc");
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalSales, setTotalSales] = useState(0);
  const [medicinesCount, setMedicinesCount] = useState(0);
  const [lowStockItems, setLowStockItems] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const inventory = await fetchInventory();
        setMedicines(inventory);
        setTotalRevenue(
          inventory.reduce(
            (sum, medicine) => sum + medicine.price * medicine.count,
            0
          )
        );
        setTotalSales(
          inventory.reduce((sum, medicine) => sum + medicine.count, 0)
        );
        setMedicinesCount(inventory.length);
        setLowStockItems(inventory.filter((medicine) => medicine.count < 5));
      } catch (error) {
        setError("Failed to fetch inventory");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSort = (field) => {
    const direction =
      sortField === field && sortDirection === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortDirection(direction);
    setMedicines(
      [...medicines].sort((a, b) => {
        if (field === "name") {
          return direction === "asc"
            ? a.name.localeCompare(b.name)
            : b.name.localeCompare(a.name);
        } else if (field === "price") {
          return direction === "asc" ? a.price - b.price : b.price - a.price;
        } else if (field === "count") {
          return direction === "asc" ? a.count - b.count : b.count - a.count;
        } else if (field === "uploadedAt") {
          return direction === "asc"
            ? new Date(a.uploadedAt) - new Date(b.uploadedAt)
            : new Date(b.uploadedAt) - new Date(a.uploadedAt);
        }
        return 0;
      })
    );
  };

  const handleDelete = async (id) => {
    try {
      await deleteMedicine(id);
      setMedicines(medicines.filter((medicine) => medicine.id !== id));
    } catch (error) {
      setError("Failed to delete medicine");
    }
  };

  const handleUpdateCount = async (id, count) => {
    try {
      await updateMedicineCount(id, count);
      setMedicines(
        medicines.map((medicine) =>
          medicine.id === id ? { ...medicine, count } : medicine
        )
      );
    } catch (error) {
      setError("Failed to update medicine count");
    }
  };

  return (
    <>
      <div className="flex" style={{ paddingLeft: "265px" }}>
        <SellerSidebar />
        <div className="flex-1 p-6 bg-gray-50">
          {loading ? (
            <div>Loading...</div>
          ) : error ? (
            <div>{error}</div>
          ) : (
            <>
              <StatsGrid
                totalRevenue={totalRevenue}
                totalSales={totalSales}
                medicinesCount={medicinesCount}
                lowStockItems={lowStockItems}
              />
              <MedicinesTable
                medicines={medicines}
                sortField={sortField}
                sortDirection={sortDirection}
                onSort={handleSort}
                onDelete={handleDelete}
                onUpdateCount={handleUpdateCount}
              />
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default App;
