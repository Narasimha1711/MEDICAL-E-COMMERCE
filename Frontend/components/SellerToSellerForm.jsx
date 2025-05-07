// import React, { useState, useEffect } from "react";
// import axios from "axios";

// const SellerToSellerForm = ({ seller, onRequestCreated }) => {
//   const [sellerMedicines, setSellerMedicines] = useState([]);
//   useEffect(() => {
//     if (seller && seller._id) {
//       axios.get(`/api/seller2seller/seller-medicines/${seller._id}`)
//         .then(res => setSellerMedicines(res.data))
//         .catch(() => setSellerMedicines([]));
//     }
//   }, [seller]);
//   const [type, setType] = useState("buy");
//   const [medicineName, setMedicineName] = useState("");
//   const [quantity, setQuantity] = useState(1);
//   const [expiry, setExpiry] = useState("");
//   const [manufacture, setManufacture] = useState("");
//   const [error, setError] = useState("");

//   // Only allow selling medicines in inventory
//   const medicineOptions = type === "sell"
//     ? sellerMedicines.map(med => ({ name: med.name, count: med.count }))
//     : [];

//   // Set default selected medicine when sellerMedicines or type changes
//   useEffect(() => {
//     if (type === "sell" && sellerMedicines.length > 0 && sellerMedicines[0].name) {
//       setMedicineName(sellerMedicines[0].name);
//     }
//   }, [type, sellerMedicines]);

//   console.log('sellerMedicines:', sellerMedicines, 'medicineOptions:', medicineOptions);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (type === "sell") {
//       // Validate seller has enough quantity
//       const med = sellerMedicines.find(m => m.name === medicineName);
//       if (!med) {
//         setError("You do not own this medicine");
//         return;
//       }
//       if (quantity > med.count) {
//         setError(`You only have ${med.count} in stock`);
//         return;
//       }
//       if (!expiry || !manufacture) {
//         setError("Please provide expiry and manufacture dates");
//         return;
//       }
//     }
//     try {
//       await axios.post("/api/seller2seller/request", {
//         sellerId: seller._id,
//         type,
//         medicineName,
//         quantity,
//         expiry: type === "sell" ? expiry : undefined,
//         manufacture: type === "sell" ? manufacture : undefined
//       });
//       setMedicineName("");
//       setQuantity(1);
//       setExpiry("");
//       setManufacture("");
//       setError("");
//       if (onRequestCreated) onRequestCreated();
//     } catch (err) {
//       setError("Failed to create request");
//     }
//   };

//   return (
//     <form className="seller2seller-form" onSubmit={handleSubmit}>
//       <select value={type} onChange={e => setType(e.target.value)}>
//         <option value="buy">Buy</option>
//         <option value="sell">Sell</option>
//       </select>
//       {type === "sell" ? (
//         <select
//           value={medicineName}
//           onChange={e => setMedicineName(e.target.value)}
//           required
//         >
//           <option value="">Select medicine</option>
//           {medicineOptions.map(med => (
//             <option key={med.name || med._id} value={med.name}>
//               {(med.name || "Unnamed Medicine")} (Available: {med.count})
//             </option>
//           ))}
//         </select>
//       ) : (
//         <input type="text" placeholder="Medicine Name" value={medicineName} onChange={e => setMedicineName(e.target.value)} required />
//       )}
//       <input
//         type="number"
//         min="1"
//         max={type === "sell" && medicineName ? (sellerMedicines.find(m => m.name === medicineName)?.count || "") : undefined}
//         placeholder="Quantity"
//         value={quantity}
//         onChange={e => setQuantity(Number(e.target.value))}
//         required
//       />
//       {type === "sell" && (
//         <>
//           <input type="date" placeholder="Expiry Date" value={expiry} onChange={e => setExpiry(e.target.value)} required />
//           <input type="date" placeholder="Manufacture Date" value={manufacture} onChange={e => setManufacture(e.target.value)} required />
//         </>
//       )}
//       <button type="submit">Send Request</button>
//       {error && <div style={{color:'red'}}>{error}</div>}
//     </form>
//   );
// };

// export default SellerToSellerForm;

















// import React, { useState, useEffect } from "react";
// import { Package, AlertCircle, Check } from "lucide-react";

// const SellerToSellerForm = ({ seller, onRequestCreated }) => {
//   const [sellerMedicines, setSellerMedicines] = useState([]);
//   const [medicineName, setMedicineName] = useState("");
//   const [quantity, setQuantity] = useState(10);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [showSuccess, setShowSuccess] = useState(false);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     if (seller && seller._id) {
//       fetch(`/api/seller2seller/seller-medicines/${seller._id}`, {
//         credentials: "include",
//       })
//         .then((res) => res.json())
//         .then((data) => {
//           const eligible = data.filter((med) => med.count >= 10);
//           setSellerMedicines(eligible);
//           if (eligible.length > 0) {
//             setMedicineName(eligible[0].name);
//           }
//         })
//         .catch(() => {
//           setSellerMedicines([]);
//         });
//     }
//   }, [seller]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsSubmitting(true);
//     setError("");

//     const selectedMed = sellerMedicines.find((m) => m.name === medicineName);
//     if (!selectedMed) {
//       setError("Invalid medicine selected.");
//       setIsSubmitting(false);
//       return;
//     }

//     if (quantity < 10) {
//       setError("Minimum order quantity is 10.");
//       setIsSubmitting(false);
//       return;
//     }

//     if (quantity > selectedMed.count) {
//       setError(`Only ${selectedMed.count} units available.`);
//       setIsSubmitting(false);
//       return;
//     }

//     try {
//       const response = await fetch("http://localhost:9001/s2s/placebulkorder", {
//         method: "POST",
//         credentials: "include",
//         headers: {
//           "Content-Type": "application/json",
//           "Cache-Control": "no-cache",
//         },
//         body: JSON.stringify({
//           medicineName,
//           quantity,
//         }),
//       });

//       if (!response.ok) {
//         const data = await response.json();
//         throw new Error(data.message || "Failed to place bulk order");
//       }

//       setShowSuccess(true);
//       setQuantity(10);
//       setTimeout(() => setShowSuccess(false), 3000);
//       if (onRequestCreated) onRequestCreated();
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <div className="bg-white rounded-lg p-6">
//       <div className="flex items-center mb-6">
//         <Package className="h-5 w-5 text-teal-600 mr-2" />
//         <h2 className="text-xl font-semibold text-gray-800">Create Bulk Sale</h2>
//       </div>

//       <form onSubmit={handleSubmit} className="space-y-6">
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <div className="space-y-2">
//             <label className="block text-sm font-medium text-gray-700">Medicine Name</label>
//             <select
//               value={medicineName}
//               onChange={(e) => setMedicineName(e.target.value)}
//               required
//               className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
//             >
//               {sellerMedicines.map((med) => (
//                 <option key={med.name} value={med.name}>
//                   {med.name} (Available: {med.count})
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div className="space-y-2">
//             <label className="block text-sm font-medium text-gray-700">Quantity</label>
//             <input
//               type="number"
//               min="10"
//               value={quantity}
//               onChange={(e) => setQuantity(Number(e.target.value))}
//               required
//               className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
//             />
//           </div>
//         </div>

//         {error && (
//           <div className="flex items-center p-4 text-red-800 bg-red-50 rounded-lg">
//             <AlertCircle className="h-5 w-5 mr-2" />
//             {error}
//           </div>
//         )}

//         {showSuccess && (
//           <div className="flex items-center p-4 text-green-800 bg-green-50 rounded-lg">
//             <Check className="h-5 w-5 mr-2" />
//             Bulk order placed successfully!
//           </div>
//         )}

//         <div className="flex justify-end">
//           <button
//             type="submit"
//             disabled={isSubmitting}
//             className={`${
//               isSubmitting
//                 ? "bg-gray-400 cursor-not-allowed"
//                 : "bg-teal-600 hover:bg-teal-700"
//             } text-white px-6 py-2 rounded-lg transition-colors duration-300 flex items-center`}
//           >
//             {isSubmitting ? (
//               <>
//                 <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
//                 Processing...
//               </>
//             ) : (
//               <>
//                 <Package className="h-4 w-4 mr-2" />
//                 Place Bulk Order
//               </>
//             )}
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default SellerToSellerForm;





import React, { useState, useEffect } from "react";
import axios from "axios";
import { Package, AlertCircle, Check } from "lucide-react";

const SellerToSellerForm = ({ seller, onRequestCreated }) => {
  const [sellerMedicines, setSellerMedicines] = useState([]);
  const [medicineName, setMedicineName] = useState("");
  const [quantity, setQuantity] = useState(10);
  const [price, setPrice] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (seller && seller._id) {
      axios
        .get(`/api/seller2seller/seller-medicines/${seller._id}`, {
          withCredentials: true,
        })
        .then((res) => {
          const eligible = res.data.filter((med) => med.count >= 10);
          setSellerMedicines(eligible);
        })
        .catch(() => {
          setSellerMedicines([]);
        });
    }
  }, [seller]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    if (!medicineName) {
      setError("Please select a medicine.");
      setIsSubmitting(false);
      return;
    }

    const selectedMed = sellerMedicines.find((m) => m.name === medicineName);
    if (!selectedMed) {
      setError("Invalid medicine selected.");
      setIsSubmitting(false);
      return;
    }

    if (quantity < 10) {
      setError("Minimum order quantity is 10.");
      setIsSubmitting(false);
      return;
    }

    if (quantity > selectedMed.count) {
      setError(`Only ${selectedMed.count} units available.`);
      setIsSubmitting(false);
      return;
    }

    if (!price || Number(price) <= 0) {
      setError("Please enter a valid price greater than 0.");
      setIsSubmitting(false);
      return;
    }

    try {
      await fetch("http://localhost:9001/s2s/addbulkorder", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache",
        },
        body: JSON.stringify({ medicineName, quantity, price }),
      });

      setShowSuccess(true);
      setQuantity(10);
      setMedicineName("");
      setPrice("");
      setTimeout(() => setShowSuccess(false), 3000);
      if (onRequestCreated) onRequestCreated();
    } catch (err) {
      setError("Failed to place bulk order.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg p-6">
      <div className="flex items-center mb-6">
        <Package className="h-5 w-5 text-teal-600 mr-2" />
        <h2 className="text-xl font-semibold text-gray-800">Create Bulk Sale</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Medicine Name</label>
            <select
              value={medicineName}
              onChange={(e) => setMedicineName(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              disabled={sellerMedicines.length === 0}
            >
              <option value="">Select a medicine</option>
              {sellerMedicines.map((med) => (
                <option key={med.name} value={med.name}>
                  {med.name} (Available: {med.count})
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Quantity</label>
            <input
              type="number"
              min="10"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Price (per unit)</label>
            <input
              type="number"
              min="0.01"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>
        </div>

        {error && (
          <div className="flex items-center p-4 text-red-800 bg-red-50 rounded-lg">
            <AlertCircle className="h-5 w-5 mr-2" />
            {error}
          </div>
        )}

        {showSuccess && (
          <div className="flex items-center p-4 text-green-800 bg-green-50 rounded-lg">
            <Check className="h-5 w-5 mr-2" />
            Bulk order placed successfully!
          </div>
        )}

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting || sellerMedicines.length === 0}
            className={`${
              isSubmitting || sellerMedicines.length === 0
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-teal-600 hover:bg-teal-700"
            } text-white px-6 py-2 rounded-lg transition-colors duration-300 flex items-center`}
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                Processing...
              </>
            ) : (
              <>
                <Package className="h-4 w-4 mr-2" />
                Place Bulk Order
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SellerToSellerForm;
