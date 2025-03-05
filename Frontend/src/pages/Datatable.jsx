/* eslint-disable no-unused-vars */
import React, { useEffect } from "react";
import { createSlice, createAsyncThunk, configureStore } from "@reduxjs/toolkit";
import { Provider, useSelector, useDispatch } from "react-redux";
import { Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import SellerSidebar from "../Components/SellerSidebar";
import "./datatable.css";

// Async thunks for fetching, updating, and deleting inventory
const fetchInventory = createAsyncThunk("inventory/fetchInventory", async () => {
  const response = await fetch("http://localhost:9001/inventory", {
    method: "GET",
    credentials: "include",
    headers: {
      "Cache-Control": "no-cache",
    },
  });
  if (!response.ok) throw new Error("Failed to fetch inventory");
  return response.json();
});

const updateQuantity = createAsyncThunk("inventory/updateQuantity", async ({ id, count }) => {
  const response = await fetch("http://localhost:9001/updateCount", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ id, count }),
  });
  if (!response.ok) throw new Error("Failed to update quantity");
  return { id, count };
});

const deleteMedicine = createAsyncThunk("inventory/deleteMedicine", async (id) => {
  const response = await fetch(`http://localhost:9001/inventory/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!response.ok) throw new Error("Failed to delete medicine");
  return id;
});

// Redux slice for inventory
const inventorySlice = createSlice({
  name: "inventory",
  initialState: {
    rows: [],
    loading: false,
    error: null,
    filters: {
      searchTerm: "",
      medicineType: "",
      dateFilter: "all",
    },
  },
  reducers: {
    setSearchTerm: (state, action) => {
      state.filters.searchTerm = action.payload;
    },
    setMedicineType: (state, action) => {
      state.filters.medicineType = action.payload;
    },
    setDateFilter: (state, action) => {
      state.filters.dateFilter = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchInventory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInventory.fulfilled, (state, action) => {
        state.rows = action.payload;
        state.loading = false;
      })
      .addCase(fetchInventory.rejected, (state, action) => {
        state.error = action.error.message;
        state.loading = false;
      })
      .addCase(updateQuantity.fulfilled, (state, action) => {
        const { id, count } = action.payload;
        const index = state.rows.findIndex((row) => row._id === id);
        if (index !== -1) state.rows[index].count = count;
      })
      .addCase(deleteMedicine.fulfilled, (state, action) => {
        state.rows = state.rows.filter((row) => row._id !== action.payload);
      });
  },
});

const { setSearchTerm, setMedicineType, setDateFilter } = inventorySlice.actions;

// Store setup
const store = configureStore({
  reducer: {
    inventory: inventorySlice.reducer,
  },
});

function MedicineCard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { rows, filters, loading, error } = useSelector((state) => state.inventory);

  useEffect(() => {
    dispatch(fetchInventory());
  }, [dispatch]);

  const handleQuantityChange = (id, count) => {
    dispatch(updateQuantity({ id, count }));
  };

  const handleDeleteClick = (id) => {
    dispatch(deleteMedicine(id));
  };

  const calculateDateFilter = () => {
    const now = new Date();
    switch (filters.dateFilter) {
      case "30m":
        return new Date(now.getTime() - 30 * 60 * 1000);
      case "60m":
        return new Date(now.getTime() - 60 * 60 * 1000);
      case "12h":
        return new Date(now.getTime() - 12 * 60 * 60 * 1000);
      case "24h":
        return new Date(now.getTime() - 24 * 60 * 60 * 1000);
      case "1M":
        return new Date(now.setMonth(now.getMonth() - 1));
      case "3M":
        return new Date(now.setMonth(now.getMonth() - 3));
      case "6M":
        return new Date(now.setMonth(now.getMonth() - 6));
      case "12M":
        return new Date(now.setMonth(now.getMonth() - 12));
      default:
        return null;
    }
  };

  const filteredRows = rows.filter((row) => {
    const searchMatch = row.medicine?.toLowerCase().includes(filters.searchTerm.toLowerCase());
    const typeMatch = filters.medicineType === "" || row.type === filters.medicineType;

    let dateMatch = true;
    if (filters.dateFilter !== "all" && row.createdAt) {
      const filterDate = calculateDateFilter();
      dateMatch = filterDate ? new Date(row.createdAt) >= filterDate : true;
    }

    return searchMatch && typeMatch && dateMatch;
  });

  return (
    <div className="inventory-container">
      <div className="inventory-layout">
        <SellerSidebar />
        <div className="main-content">
          <div className="controls-wrapper">
            <button onClick={() => navigate("/sellerAddMedicine")} className="add-button">+ Add Medicine</button>
            <div className="filters-group">
              <input
                type="text"
                placeholder="Search medicines..."
                value={filters.searchTerm}
                onChange={(e) => dispatch(setSearchTerm(e.target.value))}
                className="search-input"
              />
              <select
                value={filters.medicineType}
                onChange={(e) => dispatch(setMedicineType(e.target.value))}
                className="filter-select"
              >
                <option value="">All Types</option>
                <option value="Tablet">Tablet</option>
                <option value="Syrup">Syrup</option>
                <option value="Capsule">Capsule</option>
              </select>
              <select
                value={filters.dateFilter}
                onChange={(e) => dispatch(setDateFilter(e.target.value))}
                className="filter-select"
              >
                <option value="all">All Time</option>
                <option value="30m">Last 30 Minutes</option>
                <option value="60m">Last Hour</option>
                <option value="12h">Last 12 Hours</option>
                <option value="24h">Last 24 Hours</option>
                <option value="1M">Last Month</option>
                <option value="3M">Last 3 Months</option>
                <option value="6M">Last 6 Months</option>
                <option value="12M">Last Year</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div>Loading...</div>
          ) : error ? (
            <div>Error: {error}</div>
          ) : (
            <div className="medicine-grid">
              {filteredRows.map((row) => (
                <div key={row._id} className="medicine-card">
                  <div className="image-container">
                    <img src={`http://localhost:9001/uploads/${row.image}`} alt={row.medicineName} className="medicine-image" />
                    <button onClick={() => handleDeleteClick(row._id)} className="delete-button">
                      <Trash2 size={20} />
                    </button>
                  </div>

                  <div className="card-content">
                    <div className="card-header">
                      <h2 className="medicine-name">{row.medicine}</h2>
                      <span className={`stock-badge ${row.count < 5 ? "stock-badge-low" : row.count === 5 ? "stock-badge-medium" : "stock-badge-high"}`}>
                        Stock: {row.count}
                      </span>
                    </div>

                    <p className="medicine-price">Rs {row.price.toFixed(2)}</p>

                    <div className="quantity-controls">
                      <input
                        type="number"
                        value={row.count}
                        onChange={(e) => handleQuantityChange(row._id, parseInt(e.target.value))}
                        className="quantity-input"
                        min="0"
                      />
                      <button className="update-button">Update</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <MedicineCard />
    </Provider>
  );
}

// import React, { useEffect } from "react";
// import {
//   createSlice,
//   createAsyncThunk,
//   configureStore,
// } from "@reduxjs/toolkit";
// import { Provider, useSelector, useDispatch } from "react-redux";
// import { Trash2 } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import SellerSidebar from "../Components/SellerSidebar";
// import "./datatable.css";

// // Async thunks
// const fetchInventory = createAsyncThunk(
//   "inventory/fetchInventory",
//   async () => {
//     const response = await fetch("http://localhost:9001/api/inventory", {
//       method: "GET",
//       credentials: "include",
//       headers: { "Cache-Control": "no-cache" },
//     });
//     if (!response.ok) throw new Error("Failed to fetch inventory");
//     return response.json();
//   }
// );

// const fetchMedicinesByCategory = createAsyncThunk(
//   "inventory/fetchByCategory",
//   async (category) => {
//     const response = await fetch(
//       `http://localhost:9001/inventory/${category}`,
//       {
//         method: "GET",
//         credentials: "include",
//         headers: { "Cache-Control": "no-cache" },
//       }
//     );
//     if (!response.ok) throw new Error("Failed to fetch medicines by category");
//     return response.json();
//   }
// );

// const updateQuantity = createAsyncThunk(
//   "inventory/updateQuantity",
//   async ({ id, count }) => {
//     const response = await fetch("http://localhost:9001/api/updateCount", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       credentials: "include",
//       body: JSON.stringify({ id, count }),
//     });
//     if (!response.ok) throw new Error("Failed to update quantity");
//     return { id, count };
//   }
// );

// const deleteMedicine = createAsyncThunk(
//   "inventory/deleteMedicine",
//   async (id) => {
//     const response = await fetch(`http://localhost:9001/api/inventory/${id}`, {
//       method: "DELETE",
//       credentials: "include",
//     });
//     if (!response.ok) throw new Error("Failed to delete medicine");
//     return id;
//   }
// );

// // Redux slice
// const inventorySlice = createSlice({
//   name: "inventory",
//   initialState: {
//     rows: [],
//     loading: false,
//     error: null,
//     filters: {
//       searchTerm: "",
//       medicineType: "",
//       dateFilter: "all",
//     },
//   },
//   reducers: {
//     setSearchTerm: (state, action) => {
//       state.filters.searchTerm = action.payload;
//     },
//     setMedicineType: (state, action) => {
//       state.filters.medicineType = action.payload;
//     },
//     setDateFilter: (state, action) => {
//       state.filters.dateFilter = action.payload;
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchInventory.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchInventory.fulfilled, (state, action) => {
//         state.rows = action.payload;
//         state.loading = false;
//       })
//       .addCase(fetchInventory.rejected, (state, action) => {
//         state.error = action.error.message;
//         state.loading = false;
//       })
//       .addCase(fetchMedicinesByCategory.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchMedicinesByCategory.fulfilled, (state, action) => {
//         state.rows = action.payload;
//         state.loading = false;
//       })
//       .addCase(fetchMedicinesByCategory.rejected, (state, action) => {
//         state.error = action.error.message;
//         state.loading = false;
//       })
//       .addCase(updateQuantity.fulfilled, (state, action) => {
//         const { id, count } = action.payload;
//         const index = state.rows.findIndex((row) => row._id === id);
//         if (index !== -1) state.rows[index].count = count;
//       })
//       .addCase(deleteMedicine.fulfilled, (state, action) => {
//         state.rows = state.rows.filter((row) => row._id !== action.payload);
//       });
//   },
// });

// const { setSearchTerm, setMedicineType, setDateFilter } =
//   inventorySlice.actions;

// // Store setup
// const store = configureStore({
//   reducer: {
//     inventory: inventorySlice.reducer,
//   },
// });

// // Component
// function MedicineCard() {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const { rows, filters, loading, error } = useSelector(
//     (state) => state.inventory
//   );

//   useEffect(() => {
//     dispatch(fetchInventory());
//   }, [dispatch]);

//   const handleQuantityChange = (id, count) => {
//     dispatch(updateQuantity({ id, count }));
//   };

//   const handleDeleteClick = (id) => {
//     dispatch(deleteMedicine(id));
//   };

//   const calculateDateFilter = () => {
//     const now = new Date();
//     switch (filters.dateFilter) {
//       case "30m":
//         return new Date(now.getTime() - 30 * 60 * 1000);
//       case "60m":
//         return new Date(now.getTime() - 60 * 60 * 1000);
//       case "12h":
//         return new Date(now.getTime() - 12 * 60 * 60 * 1000);
//       case "24h":
//         return new Date(now.getTime() - 24 * 60 * 60 * 1000);
//       case "1M":
//         return new Date(now.setMonth(now.getMonth() - 1));
//       case "3M":
//         return new Date(now.setMonth(now.getMonth() - 3));
//       case "6M":
//         return new Date(now.setMonth(now.getMonth() - 6));
//       case "12M":
//         return new Date(now.setMonth(now.getMonth() - 12));
//       default:
//         return null;
//     }
//   };

//   const filteredRows = rows.filter((row) => {
//     const searchMatch = row.name
//       ?.toLowerCase()
//       .includes(filters.searchTerm.toLowerCase());
//     const typeMatch =
//       filters.medicineType === "" || row.category === filters.medicineType;

//     let dateMatch = true;
//     if (filters.dateFilter !== "all" && row.createdAt) {
//       const filterDate = calculateDateFilter();
//       dateMatch = filterDate ? new Date(row.createdAt) >= filterDate : true;
//     }

//     return searchMatch && typeMatch && dateMatch;
//   });

//   return (
//     <div className="inventory-container">
//       <div className="inventory-layout">
//         <SellerSidebar />
//         <div className="main-content">
//           <div className="controls-wrapper">
//             <button
//               onClick={() => navigate("/sellerAddMedicine")}
//               className="add-button"
//             >
//               + Add Medicine
//             </button>
//             <div className="filters-group">
//               <input
//                 type="text"
//                 placeholder="Search medicines..."
//                 value={filters.searchTerm}
//                 onChange={(e) => dispatch(setSearchTerm(e.target.value))}
//                 className="search-input"
//               />
//               <select
//                 value={filters.medicineType}
//                 onChange={(e) => {
//                   const category = e.target.value;
//                   dispatch(setMedicineType(category));
//                   if (category) {
//                     dispatch(fetchMedicinesByCategory(category));
//                   } else {
//                     dispatch(fetchInventory());
//                   }
//                 }}
//                 className="filter-select"
//               >
//                 <option value="">All Categories</option>
//                 <option value="tablets">Tablet</option>
//                 <option value="Syrup">Syrup</option>
//                 <option value="Capsule">Capsule</option>
//               </select>
//               <select
//                 value={filters.dateFilter}
//                 onChange={(e) => dispatch(setDateFilter(e.target.value))}
//                 className="filter-select"
//               >
//                 <option value="all">All Time</option>
//                 <option value="30m">Last 30 Minutes</option>
//                 <option value="60m">Last Hour</option>
//                 <option value="12h">Last 12 Hours</option>
//                 <option value="24h">Last 24 Hours</option>
//                 <option value="1M">Last Month</option>
//                 <option value="3M">Last 3 Months</option>
//                 <option value="6M">Last 6 Months</option>
//                 <option value="12M">Last Year</option>
//               </select>
//             </div>
//           </div>

//           {loading ? (
//             <div>Loading...</div>
//           ) : error ? (
//             <div>Error: {error}</div>
//           ) : (
//             <div className="medicine-grid">
//               {filteredRows.map((row) => (
//                 <div key={row._id} className="medicine-card">
//                   <div className="image-container">
//                     <img
//                       src={`http://localhost:9001/uploads/${row.image}`}
//                       alt={row.name}
//                       className="medicine-image"
//                     />
//                     <button
//                       onClick={() => handleDeleteClick(row._id)}
//                       className="delete-button"
//                     >
//                       <Trash2 size={20} />
//                     </button>
//                   </div>

//                   <div className="card-content">
//                     <div className="card-header">
//                       <h2 className="medicine-name">{row.name}</h2>
//                       <span
//                         className={`stock-badge ${
//                           row.count < 5
//                             ? "stock-badge-low"
//                             : row.count === 5
//                             ? "stock-badge-medium"
//                             : "stock-badge-high"
//                         }`}
//                       >
//                         {row.count} in stock
//                       </span>
//                     </div>
//                     <p className="medicine-category">
//                       Category: {row.category}
//                     </p>
//                     <p className="medicine-price">₹ {row.price}</p>
//                   </div>

//                   <div className="quantity-controls">
//                     <button
//                       onClick={() =>
//                         handleQuantityChange(row._id, row.count - 1)
//                       }
//                       disabled={row.count === 0}
//                     >
//                       -
//                     </button>
//                     <span>{row.count}</span>
//                     <button
//                       onClick={() =>
//                         handleQuantityChange(row._id, row.count + 1)
//                       }
//                     >
//                       +
//                     </button>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// // App Component
// function App() {
//   return (
//     <Provider store={store}>
//       <MedicineCard />
//     </Provider>
//   );
// }

// export default App;
