// import React, { useContext, useState } from "react";
// import SellerToSellerForm from "../../components/SellerToSellerForm";
// import SellerToSellerPage from "../../components/SellerToSellerPage";
// import AvailableStock from "./Availablestock";
// import { SellerContextData } from "../SellerContext";

// const SellerB2B = () => {
//   const { sellerData } = useContext(SellerContextData);
//   const [refresh, setRefresh] = useState(false);

//   if (!sellerData) return <div>Please log in as a seller to access this page.</div>;

//   return (
//     <div style={{ padding: 24 }}>
//       <h2>Seller-to-Seller: Buy/Sell Medicines</h2>

//       <SellerToSellerForm seller={sellerData} onRequestCreated={() => setRefresh(r => !r)} />

//       <div style={{ marginTop: 32 }}>
//         <SellerToSellerPage seller={sellerData} refresh={refresh} />
//       </div>

//       <div style={{ marginTop: 48 }}>
//         <AvailableStock /> {/* ✅ Added below SellerToSellerPage */}
//       </div>
//     </div>
//   );
// };

// export default SellerB2B;







import React, { useContext, useState } from "react";
import SellerToSellerForm from "../../components/SellerToSellerForm";
import SellerToSellerPage from "../../components/SellerToSellerPage";
import AvailableStock from "./Availablestock";
import { SellerContextData } from "../SellerContext";
import SellerSidebar from "../Components/SellerSidebar";
import { ShoppingBag, Pill, RefreshCw, Store, ClipboardList } from "lucide-react";

const SellerB2B = () => {
  const { sellerData } = useContext(SellerContextData);
  const [refresh, setRefresh] = useState(false);
  const [activeTab, setActiveTab] = useState("create");

  if (!sellerData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
          <Store className="w-16 h-16 text-teal-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Seller Access Required</h2>
          <p className="text-gray-600 mb-6">Please log in as a seller to access the B2B medicine marketplace.</p>
          <button 
            className="bg-teal-600 text-white px-6 py-2 rounded-lg hover:bg-teal-700 transition-colors duration-300"
            onClick={() => window.location.href = '/login'}
          >
            Log In
          </button>
        </div>
      </div>
    );
  }

  const handleRefresh = () => {
    setRefresh(r => !r);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
          <div className="flex items-center mb-4 sm:mb-0">
            <ShoppingBag className="h-8 w-8 text-teal-600 mr-3" />
            <h1 className="text-2xl font-bold text-gray-800">Seller-to-Seller Marketplace</h1>
          </div>
          
          <div className="flex items-center">
            <div className="bg-teal-100 text-teal-800 px-3 py-1 rounded-full text-sm font-medium flex items-center">
              <Store className="h-4 w-4 mr-1" />
              {sellerData.name}
            </div>
            <button 
              onClick={handleRefresh} 
              className="ml-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
              title="Refresh Data"
            >
              <RefreshCw className="h-5 w-5 text-gray-600" />
            </button>
          </div>
        </div>
        
        <p className="text-gray-600 mb-6">
          Connect with other certified pharmacies to buy or sell medicines. Expand your inventory and fulfill customer needs efficiently.
        </p>
        
        {/* Navigation Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-6">
            <button
              onClick={() => setActiveTab("create")}
              className={`pb-3 px-1 ${
                activeTab === "create"
                  ? "border-b-2 border-teal-600 text-teal-700 font-medium"
                  : "text-gray-500 hover:text-gray-700 hover:border-gray-300 border-b-2 border-transparent"
              } transition-colors duration-200 flex items-center`}
            >
              <Pill className="mr-2 h-5 w-5" />
              Create Request
            </button>
            <button
              onClick={() => setActiveTab("requests")}
              className={`pb-3 px-1 ${
                activeTab === "requests"
                  ? "border-b-2 border-teal-600 text-teal-700 font-medium"
                  : "text-gray-500 hover:text-gray-700 hover:border-gray-300 border-b-2 border-transparent"
              } transition-colors duration-200 flex items-center`}
            >
              <ClipboardList className="mr-2 h-5 w-5" />
              My Requests
            </button>
            <button
              onClick={() => setActiveTab("stock")}
              className={`pb-3 px-1 ${
                activeTab === "stock"
                  ? "border-b-2 border-teal-600 text-teal-700 font-medium"
                  : "text-gray-500 hover:text-gray-700 hover:border-gray-300 border-b-2 border-transparent"
              } transition-colors duration-200 flex items-center`}
            >
              <ShoppingBag className="mr-2 h-5 w-5" />
              Available Stock From Other Sellers
            </button>
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        {activeTab === "create" && (
          <div className="animate-fadeIn">
            <SellerToSellerForm seller={sellerData} onRequestCreated={handleRefresh} />
          </div>
        )}
        
        {activeTab === "requests" && (
          <div className="animate-fadeIn">
            <SellerToSellerPage seller={sellerData} refresh={refresh} />
          </div>
        )}
        
        {activeTab === "stock" && (
          <div className="animate-fadeIn">
            <AvailableStock />
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerB2B;