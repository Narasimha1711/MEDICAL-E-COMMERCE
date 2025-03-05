import React from 'react'
import Footer from './Footer'
import { Outlet } from 'react-router-dom'
import Sidebar from './UserSidebar'
const DashboardLayout = () => {
  return (
    <>

        {/* <Outlet /> */}
        {/* <Footer /> */}

        <div className="flex min-h-screen bg-gray-50/50">
        <Sidebar />
        
        
        <main className="flex-1 lg:ml-64 min-h-screen transition-all duration-300">
          <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 animate-fade-in">
            {/* <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/past-orders" element={<PastOrders />} />
              <Route path="/wishlist" element={<Wishlist />} />
              <Route path="/addresses" element={<Addresses />} />
              <Route path="/profile" element={<Profile />} />
            </Routes> */}
            <Outlet />
          </div>
        </main>
      </div>
      <Footer />
    </>
  )
}

export default DashboardLayout
