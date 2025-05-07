// import React, { useEffect, useState } from "react";
// import { Store, Search, Package, AlertCircle, RefreshCw, X } from "lucide-react";
// import axios from "axios";

// const AvailableStock = ({ seller }) => {
//   const [stockData, setStockData] = useState([]);
//   const [buyerMedicines, setBuyerMedicines] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [searchTerm, setSearchTerm] = useState("");
//   const [showForm, setShowForm] = useState(false);
//   const [selectedMedicine, setSelectedMedicine] = useState(null);
//   const [formData, setFormData] = useState({
//     medicineName: "",
//     price: "",
//     count: "",
//     description: "",
//     category: "tablets",
//     image: null,
//   });

//   // Fetch buyer's medicines at the start
//   useEffect(() => {
//     if (seller && seller._id) {
//       axios
//         .get(`http://localhost:9001/api/seller2seller/seller-medicines/${seller._id}`, {
//           withCredentials: true,
//         })
//         .then((res) => {
//           const eligible = res.data.filter((med) => med.count >= 10);
//           setBuyerMedicines(eligible);
//           console.log("Eligible buyer medicines:", eligible);
//         })
//         .catch((err) => {
//           console.error("Failed to fetch buyer medicines:", err);
//           setBuyerMedicines([]);
//         });
//     }
//   }, [seller]);

//   const fetchAvailableStock = async () => {
//     try {
//       const response = await fetch("http://localhost:9001/s2s/availableStock", {
//         method: "GET",
//         credentials: "include",
//         headers: {
//           "Cache-Control": "no-cache",
//         },
//       });

//       if (!response.ok) {
//         const err = await response.json();
//         throw new Error(err.message || "Failed to fetch available stock");
//       }

//       const result = await response.json();
//       setStockData(result.data);
//       setLoading(false);
//     } catch (err) {
//       setError(err.message);
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchAvailableStock();
//   }, []);

//   const handleOrder = (item) => {
//     // Compare medicineName from stockData with medicine from buyerMedicines
//     const isMedicineInBuyerList = buyerMedicines.some(
//       (med) => med.medicine.toLowerCase() === item.medicineName.toLowerCase()
//     );

//     console.log("Checking medicine:", item.medicineName);
//     console.log("Buyer medicines:", buyerMedicines);
//     console.log("Is medicine in buyer list?", isMedicineInBuyerList);

//     if (isMedicineInBuyerList) {
//       // Medicine exists in buyerMedicines, proceed with flag: 1
//       placeOrder(item._id, 1);
//     } else {
//       // Medicine not in buyerMedicines, show form
//       setSelectedMedicine(item);
//       setFormData({
//         medicineName: item.medicineName,
//         price: "",
//         count: "",
//         description: "",
//         category: "tablets",
//         image: null,
//       });
//       setShowForm(true);
//     }
//   };

//   const placeOrder = async (requestId, flag) => {
//     try {
//       const payload = { requestId, flag };
//       if (flag === 2) {
//         const formDataToSend = new FormData();
//         formDataToSend.append("medicineName", formData.medicineName);
//         formDataToSend.append("price", formData.price);
//         formDataToSend.append("count", formData.count);
//         formDataToSend.append("description", formData.description);
//         formDataToSend.append("category", formData.category);
//         if (formData.image) {
//           formDataToSend.append("image", formData.image);
//         }
//         payload.medicineDetails = formDataToSend;
//       }

//       const response = await fetch("http://localhost:9001/s2s/buybulkorder", {
//         method: "POST",
//         credentials: "include",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(payload),
//       });

//       if (!response.ok) {
//         const err = await response.json();
//         throw new Error(err.message || "Failed to place order");
//       }

//       await fetchAvailableStock(); // Refresh stock after placing order
//       alert("Order placed successfully!");
//       setShowForm(false);
//       setSelectedMedicine(null);
//     } catch (err) {
//       alert(`Order failed: ${err.message}`);
//     }
//   };

//   const handleFormSubmit = (e) => {
//     e.preventDefault();
//     if (selectedMedicine) {
//       placeOrder(selectedMedicine._id, 2);
//     }
//   };

//   const handleFormChange = (e) => {
//     const { name, value, files } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: files ? files[0] : value,
//     }));
//   };

//   const filteredStock = stockData.filter(
//     (item) =>
//       item.medicineName.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       item.sellerId?.shopName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       item.sellerId?.email?.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   if (loading) {
//     return (
//       <div className="min-h-[400px] flex items-center justify-center">
//         <div className="flex flex-col items-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
//           <p className="mt-4 text-gray-600">Loading available stock...</p>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-[200px] flex items-center justify-center">
//         <div className="bg-red-50 text-red-800 rounded-lg p-4 flex items-start">
//           <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
//           <span>Error: {error}</span>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="bg-white rounded-lg shadow-sm">
//       <div className="p-6 border-b border-gray-200">
//         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
//           <div className="flex items-center">
//             <Store className="h-6 w-6 text-teal-600 mr-2" />
//             <h2 className="text-xl font-semibold text-gray-800">
//               Available Stock From Other Sellers
//             </h2>
//           </div>
//           <div className="flex items-center gap-4 w-full sm:w-auto">
//             <div className="relative flex-1 sm:flex-none">
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
//               <input
//                 type="text"
//                 placeholder="Search medicines or sellers..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="pl-10 pr-4 py-2 w-full sm:w-64 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
//               />
//             </div>
//             <button
//               onClick={fetchAvailableStock}
//               className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
//               title="Refresh stock"
//             >
//               <RefreshCw className="h-5 w-5 text-gray-600" />
//             </button>
//           </div>
//         </div>
//       </div>

//       {stockData.length === 0 ? (
//         <div className="p-12 text-center">
//           <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
//           <h3 className="text-lg font-medium text-gray-900 mb-2">
//             No Stock Available
//           </h3>
//           <p className="text-gray-500">
//             There are currently no medicines available from other sellers.
//           </p>
//         </div>
//       ) : filteredStock.length === 0 ? (
//         <div className="p-12 text-center">
//           <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
//           <h3 className="text-lg font-medium text-gray-900 mb-2">
//             No Results Found
//           </h3>
//           <p className="text-gray-500">
//             Try adjusting your search terms or clear the search.
//           </p>
//         </div>
//       ) : (
//         <div className="overflow-x-auto">
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Shop Name
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Email
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Medicine Name
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Quantity
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Price
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Total Cost
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Actions
//                 </th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {filteredStock.map((item, index) => (
//                 <tr
//                   key={index}
//                   className={index % 2 === 0 ? "bg-white" : "bg-gray-50 hover:bg-gray-100"}
//                 >
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <div className="text-sm font-medium text-gray-900">
//                       {item.sellerId?.shopName || "N/A"}
//                     </div>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <div className="text-sm text-gray-500">
//                       {item.sellerId?.email || "N/A"}
//                     </div>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <div className="text-sm text-gray-900">{item.medicineName}</div>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <div className="text-sm text-gray-900">{item.quantity}</div>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <div className="text-sm text-gray-900">${item.price}</div>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <div className="text-sm text-gray-900">
//                       ${(item.price * item.quantity).toFixed(2)}
//                     </div>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <button
//                       onClick={() => handleOrder(item)}
//                       className="bg-teal-100 text-teal-700 hover:bg-teal-200 transition-colors duration-200 px-3 py-1 rounded-lg text-sm font-medium flex items-center"
//                     >
//                       <Package className="w-4 h-4 mr-1" />
//                       Order
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}

//       {showForm && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white rounded-lg p-6 w-full max-w-md">
//             <div className="flex justify-between items-center mb-4">
//               <h3 className="text-lg font-semibold">Add Medicine Details</h3>
//               <button onClick={() => setShowForm(false)}>
//                 <X className="h-5 w-5 text-gray-600" />
//               </button>
//             </div>
//             <form onSubmit={handleFormSubmit}>
//               <div className="mb-4">
//                 <label className="block text-sm font-medium text-gray-700">
//                   Medicine Name
//                 </label>
//                 <input
//                   type="text"
//                   name="medicineName"
//                   value={formData.medicineName}
//                   onChange={handleFormChange}
//                   className="mt-1 block w-full border border-gray-300 rounded-lg p-2"
//                   required
//                   readOnly
//                 />
//               </div>
//               <div className="mb-4">
//                 <label className="block text-sm font-medium text-gray-700">
//                   Price
//                 </label>
//                 <input
//                   type="number"
//                   name="price"
//                   value={formData.price}
//                   onChange={handleFormChange}
//                   className="mt-1 block w-full border border-gray-300 rounded-lg p-2"
//                   required
//                 />
//               </div>
//               <div className="mb-4">
//                 <label className="block text-sm font-medium text-gray-700">
//                   Count
//                 </label>
//                 <input
//                   type="number"
//                   name="count"
//                   value={formData.count}
//                   onChange={handleFormChange}
//                   className="mt-1 block w-full border border-gray-300 rounded-lg p-2"
//                   required
//                 />
//               </div>
//               <div className="mb-4">
//                 <label className="block text-sm font-medium text-gray-700">
//                   Description
//                 </label>
//                 <textarea
//                   name="description"
//                   value={formData.description}
//                   onChange={handleFormChange}
//                   className="mt-1 block w-full border border-gray-300 rounded-lg p-2"
//                   rows="4"
//                   required
//                 />
//               </div>
//               <div className="mb-4">
//                 <label className="block text-sm font-medium text-gray-700">
//                   Category
//                 </label>
//                 <select
//                   name="category"
//                   value={formData.category}
//                   onChange={handleFormChange}
//                   className="mt-1 block w-full border border-gray-300 rounded-lg p-2"
//                   required
//                 >
//                   <option value="tablets">Tablets</option>
//                   <option value="syrup">Syrup</option>
//                   <option value="capsules">Capsules</option>
//                 </select>
//               </div>
//               <div className="mb-4">
//                 <label className="block text-sm font-medium text-gray-700">
//                   Image
//                 </label>
//                 <input
//                   type="file"
//                   name="image"
//                   onChange={handleFormChange}
//                   className="mt-1 block w-full border border-gray-300 rounded-lg p-2"
//                 />
//                 {formData.image && (
//                   <img
//                     src={URL.createObjectURL(formData.image)}
//                     alt="Preview"
//                     className="mt-2 h-20 w-20 object-cover"
//                   />
//                 )}
//               </div>
//               <div className="flex justify-end gap-4">
//                 <button
//                   type="button"
//                   onClick={() => setShowForm(false)}
//                   className="px-4 py-2 bg-gray-200 rounded-lg"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   className="px-4 py-2 bg-teal-500 text-white rounded-lg"
//                 >
//                   Submit
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AvailableStock;


import React, { useEffect, useState } from "react";
import { Store, Search, Package, AlertCircle, RefreshCw, X } from "lucide-react";
import axios from "axios";

const AvailableStock = ({ seller }) => {
  const [stockData, setStockData] = useState([]);
  const [buyerMedicines, setBuyerMedicines] = useState([]);
  const [loadingStock, setLoadingStock] = useState(true);
  const [loadingBuyerMedicines, setLoadingBuyerMedicines] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const [sellerId, setSellerId] = useState(null);
  const [formData, setFormData] = useState({
    medicineName: "",
    price: "",
    discount: "0", // Default discount percentage
    discountedPrice: "", // Calculated field
    count: "",
    description: "",
    category: "tablets",
    image: null,
  });

  // Fetch seller._id from backend
  useEffect(() => {
    const fetchSellerId = async () => {
      try {
        console.log("Fetching seller ID from backend...");
        const response = await axios.get(
          "http://localhost:9001/s2s/get-seller-id",
          { withCredentials: true }
        );
        const { sellerId } = response.data;
        console.log("Seller ID fetched:", sellerId);
        setSellerId(sellerId);
      } catch (err) {
        console.error("Failed to fetch seller ID:", err);
        setError("Failed to fetch seller ID");
        setLoadingBuyerMedicines(false);
      }
    };

    fetchSellerId();
  }, []);

  // Calculate discounted price whenever price or discount changes
  useEffect(() => {
    if (formData.price && formData.discount) {
      const originalPrice = parseFloat(formData.price);
      const discountPercentage = parseFloat(formData.discount);
      
      if (!isNaN(originalPrice) && !isNaN(discountPercentage)) {
        const discountAmount = originalPrice * (discountPercentage / 100);
        const calculatedDiscountedPrice = originalPrice - discountAmount;
        
        setFormData(prev => ({
          ...prev,
          discountedPrice: calculatedDiscountedPrice.toFixed(2)
        }));
      }
    }
  }, [formData.price, formData.discount]);

  // Fetch buyer's medicines with retry mechanism
  useEffect(() => {
    const fetchBuyerMedicines = async (attempt = 1, maxAttempts = 3) => {
      if (!sellerId) {
        console.error("No seller ID available to fetch medicines");
        setLoadingBuyerMedicines(false);
        setBuyerMedicines([]);
        return;
      }

      console.log("Fetching buyer medicines for seller._id:", sellerId);
      try {
        const response = await axios.get(
          `http://localhost:9001/api/seller2seller/seller-medicines/${sellerId}`,
          { withCredentials: true }
        );
        const medicines = response.data;
        console.log("Raw API response for medicines:", response.data);
        setBuyerMedicines(medicines);
        console.log("All buyer medicines fetched:", medicines);
        // Log each medicine name for debugging
        medicines.forEach((med) => {
          console.log("koooooo");
          console.log(`Medicine name: "${med.medicine}" (${typeof med.medicine})`);
        });
        setLoadingBuyerMedicines(false);
      } catch (err) {
        console.error(`Failed to fetch buyer medicines (attempt ${attempt}):`, err);
        if (attempt < maxAttempts) {
          console.log(`Retrying fetch (attempt ${attempt + 1})...`);
          setTimeout(() => fetchBuyerMedicines(attempt + 1, maxAttempts), 1000);
        } else {
          console.error("Max retry attempts reached. Setting empty buyerMedicines.");
          setBuyerMedicines([]);
          setLoadingBuyerMedicines(false);
        }
      }
    };

    if (sellerId) {
      fetchBuyerMedicines();
    }
  }, [sellerId]);

  const fetchAvailableStock = async () => {
    try {
      const response = await fetch("http://localhost:9001/s2s/availableStock", {
        method: "GET",
        credentials: "include",
        headers: {
          "Cache-Control": "no-cache",
        },
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || "Failed to fetch available stock");
      }

      const result = await response.json();
      console.log("Available stock data:", result.data);
      setStockData(result.data);
      setLoadingStock(false);
    } catch (err) {
      setError(err.message);
      setLoadingStock(false);
    }
  };

  useEffect(() => {
    fetchAvailableStock();
  }, []);

  const handleOrder = (item) => {
    console.log("Ordering medicine:", item.medicineName);
    console.log("Current buyer medicines:", buyerMedicines);
    
    const itemName = item.medicineName || item.medicine || "";
    const normalizedItemName = itemName.toLowerCase().trim();
    
    console.log(`Item to check:`, item);
    console.log(`Normalized medicine name to check: "${normalizedItemName}"`);
    
    buyerMedicines.forEach((med, index) => {
      const normalizedMedName = (med.medicine || med.medicineName || "").toLowerCase().trim();
      console.log(`Buyer medicine #${index}:`, med);
      console.log(`Buyer medicine #${index}: "${med.medicine}" → "${normalizedMedName}"`);
    });
    
    const isMedicineInBuyerList = buyerMedicines.some(med => {
      const buyerMedName = (med.medicine || med.medicineName || "").toLowerCase().trim();
      const stockMedName = normalizedItemName;
      console.log(`Comparing: "${buyerMedName}" vs "${stockMedName}" => ${buyerMedName === stockMedName}`);
      return buyerMedName === stockMedName;
    });

    console.log("Is medicine present in buyerMedicines?", isMedicineInBuyerList);

    if (isMedicineInBuyerList) {
      console.log(`Medicine ${item.medicineName} is PRESENT in buyerMedicines. Proceeding with flag: 1`);
      placeOrder(item._id, 1, {
        medicineName: item.medicineName,
        price: item.price,
        discount: "0",
        discountedPrice: item.price,
        count: item.quantity,
        description: item.description || "No description provided",
        category: item.category || "tablets",
        image: item.image || "",
      });
    } else {
      console.log(`Medicine ${item.medicineName} is NOT PRESENT in buyerMedicines. Showing form for flag: 2`);
      setSelectedMedicine(item);
      setFormData({
        medicineName: item.medicineName,
        price: item.price || "",
        discount: "0",
        discountedPrice: item.price || "",
        count: item.quantity || "",
        description: item.description || "",
        category: item.category || "tablets",
        image: null,
      });
      setShowForm(true);
    }
  };

  const placeOrder = async (requestId, flag, medicineDetails = null) => {
    try {
      const payload = { requestId, flag };
      console.log(`Placing order with flag: ${flag}, requestId: ${requestId}`);
      
      if (flag === 1 && medicineDetails) {
        payload.medicineDetails = {
          medicineName: medicineDetails.medicineName,
          price: medicineDetails.price,
          discount: medicineDetails.discount,
          discountedPrice: medicineDetails.discountedPrice,
          count: medicineDetails.count,
          description: medicineDetails.description,
          category: medicineDetails.category,
          image: medicineDetails.image,
        };
        console.log("Adding to inventory with existing medicine details:", payload.medicineDetails);
      } else if (flag === 2) {
        payload.medicineDetails = {
          medicineName: formData.medicineName,
          price: formData.price,
          discount: formData.discount,
          discountedPrice: formData.discountedPrice,
          count: formData.count,
          description: formData.description,
          category: formData.category,
          image: formData.image ? formData.image.name : "",
        };
        console.log("Creating new medicine with details:", payload.medicineDetails);
      }

      console.log("Placing order with payload:", payload);

      const response = await fetch("http://localhost:9001/s2s/buybulkorder", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || "Failed to place order");
      }

      if (flag === 2 && formData.image) {
        const imageFormData = new FormData();
        imageFormData.append("image", formData.image);
        await fetch("http://localhost:9001/s2s/upload-image", {
          method: "POST",
          credentials: "include",
          body: imageFormData,
        });
      }

      await fetchAvailableStock();
      alert("Order placed successfully!");
      setShowForm(false);
      setSelectedMedicine(null);
    } catch (err) {
      alert(`Order failed: ${err.message}`);
      console.error("Order placement error:", err);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (selectedMedicine) {
      placeOrder(selectedMedicine._id, 2);
    }
  };

  const handleFormChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const filteredStock = stockData.filter(
    (item) =>
      item.medicineName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sellerId?.shopName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sellerId?.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loadingStock || loadingBuyerMedicines) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
          <p className="mt-4 text-gray-600">
            Loading {loadingStock ? "stock" : "buyer medicines"}...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[200px] flex items-center justify-center">
        <div className="bg-red-50 text-red-800 rounded-lg p-4 flex items-start">
          <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
          <span>Error: {error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center">
            <Store className="h-6 w-6 text-teal-600 mr-2" />
            <h2 className="text-xl font-semibold text-gray-800">
              Available Stock From Other Sellers
            </h2>
          </div>
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-none">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search medicines or sellers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full sm:w-64 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={fetchAvailableStock}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
              title="Refresh stock"
            >
              <RefreshCw className="h-5 w-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      <div className="py-4 px-6 bg-gray-100 border-b border-gray-200">
        <div className="flex flex-col">
          <div className="text-sm font-medium text-gray-700 mb-2">Debug Information:</div>
          <div className="text-sm text-gray-600">
            <strong>Buyer Medicines:</strong> {buyerMedicines.length > 0 ? buyerMedicines.map(med => med.medicine).join(', ') : 'None loaded'}
          </div>
          <details className="mt-2">
            <summary className="cursor-pointer text-sm text-blue-600 hover:text-blue-800">
              Show detailed medicine data
            </summary>
            <div className="p-2 mt-2 border border-gray-200 rounded bg-gray-50 text-xs overflow-auto max-h-40">
              <pre>{JSON.stringify(buyerMedicines, null, 2)}</pre>
            </div>
          </details>
        </div>
      </div>

      {stockData.length === 0 ? (
        <div className="p-12 text-center">
          <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No Stock Available
          </h3>
          <p className="text-gray-500">
            There are currently no medicines available from other sellers.
          </p>
        </div>
      ) : filteredStock.length === 0 ? (
        <div className="p-12 text-center">
          <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No Results Found
          </h3>
          <p className="text-gray-500">
            Try adjusting your search terms or clear the search.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Shop Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Medicine Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quantity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Cost
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredStock.map((item, index) => (
                <tr
                  key={index}
                  className={index % 2 === 0 ? "bg-white" : "bg-gray-50 hover:bg-gray-100"}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {item.sellerId?.shopName || "N/A"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {item.sellerId?.email || "N/A"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{item.medicineName}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{item.quantity}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">${item.price}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleOrder(item)}
                      disabled={loadingBuyerMedicines}
                      className={`bg-teal-100 text-teal-700 hover:bg-teal-200 transition-colors duration-200 px-3 py-1 rounded-lg text-sm font-medium flex items-center ${
                        loadingBuyerMedicines ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                    >
                      <Package className="w-4 h-4 mr-1" />
                      Order
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Add Medicine Details</h3>
              <button onClick={() => setShowForm(false)}>
                <X className="h-5 w-5 text-gray-600" />
              </button>
            </div>
            <form onSubmit={handleFormSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Medicine Name
                </label>
                <input
                  type="text"
                  name="medicineName"
                  value={formData.medicineName}
                  onChange={handleFormChange}
                  className="mt-1 block w-full border border-gray-300 rounded-lg p-2"
                  required
                  readOnly
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Price
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleFormChange}
                    className="mt-1 block w-full border border-gray-300 rounded-lg p-2"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Discount (%)
                  </label>
                  <input
                    type="number"
                    name="discount"
                    value={formData.discount}
                    onChange={handleFormChange}
                    className="mt-1 block w-full border border-gray-300 rounded-lg p-2"
                    min="0"
                    max="100"
                    required
                  />
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Discounted Price
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="discountedPrice"
                    value={formData.discountedPrice}
                    className="mt-1 block w-full border border-gray-300 rounded-lg p-2 bg-gray-50"
                    readOnly
                  />
                  {parseFloat(formData.discount) > 0 && (
                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm font-medium text-green-600">
                      Save {formData.discount}%
                    </span>
                  )}
                </div>
                {parseFloat(formData.discount) > 0 && (
                  <p className="text-xs text-gray-500 mt-1">
                    Original: ${formData.price} → Discounted: ${formData.discountedPrice}
                  </p>
                )}
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Count
                </label>
                <input
                  type="number"
                  name="count"
                  value={formData.count}
                  onChange={handleFormChange}
                  className="mt-1 block w-full border border-gray-300 rounded-lg p-2"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleFormChange}
                  className="mt-1 block w-full border border-gray-300 rounded-lg p-2"
                  rows="4"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Category
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleFormChange}
                  className="mt-1 block w-full border border-gray-300 rounded-lg p-2"
                  required
                >
                  <option value="tablets">Tablets</option>
                  <option value="syrup">Syrup</option>
                  <option value="capsules">Capsules</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Image
                </label>
                <input
                  type="file"
                  name="image"
                  onChange={handleFormChange}
                  className="mt-1 block w-full border border-gray-300 rounded-lg p-2"
                />
                {formData.image && (
                  <img
                    src={URL.createObjectURL(formData.image)}
                    alt="Preview"
                    className="mt-2 h-20 w-20 object-cover"
                  />
                )}
              </div>
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 bg-gray-200 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-teal-500 text-white rounded-lg"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AvailableStock;