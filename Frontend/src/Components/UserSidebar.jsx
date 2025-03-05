

import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Clock, 
  Heart, 
  MapPin, 
  User, 
  LogOut,
  Menu,
  X
} from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const NavItem = ({ to, icon, text, active, className }) => {
    return (
      <li>
        <Link
          to={to}
          className={`
            flex items-center px-4 py-3 rounded-lg text-gray-700
            transition-all duration-200
            ${active ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-gray-50'}
            ${className || ''}
          `}
          onClick={(e) => {
            if (to === '/logout') {
              e.preventDefault();
              // Handle logout
            }
            setIsMobileMenuOpen(false);
          }}
        >
          <span className="w-5 h-5 mr-3">{icon}</span>
          {text}
        </Link>
      </li>
    );
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        className="lg:hidden fixed top-4 right-4 z-50 p-2 bg-white rounded-lg shadow-md"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        {isMobileMenuOpen ? <X /> : <Menu />}
      </button>

      {/* Sidebar */}
      <nav className={`
        fixed top-0 left-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-40
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-6 border-b">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
            {/* ShopDash */}
            <Link to='/'>ShopDash</Link>
          </h2>
        </div>
        
        <ul className="mt-6 space-y-1 px-2">
          <NavItem 
            to="/userDashboard" 
            icon={<LayoutDashboard />} 
            text="Dashboard" 
            active={location.pathname === '/userDashboard'} 
          />
          <NavItem 
            to="/userDashboard/orders" 
            icon={<ShoppingBag />} 
            text="Current Orders" 
            active={location.pathname === '/userDashboard/orders'} 
          />
          <NavItem 
            to="/userDashboard/past-orders" 
            icon={<Clock />} 
            text="Past Orders" 
            active={location.pathname === '/userDashboard/past-orders'} 
          />
          {/* <NavItem 
            to="/userDashboard/wishlist" 
            icon={<Heart />} 
            text="Wishlist" 
            active={location.pathname === '/userDashboard/wishlist'} 
          />
          <NavItem 
            to="/userDashboard/addresses" 
            icon={<MapPin />} 
            text="Addresses" 
            active={location.pathname === '/userDashboard/addresses'} 
          /> */}
          <NavItem 
            to="/userDashboard/profile" 
            icon={<User />} 
            text="Profile" 
            active={location.pathname === '/userDashboard/profile'} 
          />
        </ul>

        <div className="absolute bottom-0 w-full p-4 border-t">
          
          <NavItem 
            to="/login" 
            icon={<LogOut />} 
            text="Logout" 
            className="text-gray-600 hover:text-red-600" 
          />
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-30"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;



// import "./userSidebar.css";
// import DashboardIcon from "@mui/icons-material/Dashboard";
// import BloodtypeSharpIcon from "@mui/icons-material/BloodtypeSharp";
// import MedicalInformationSharpIcon from "@mui/icons-material/MedicalInformationSharp";
// import PersonAddAltSharpIcon from "@mui/icons-material/PersonAddAltSharp";
// // eslint-disable-next-line no-unused-vars
// import QueryStatsSharpIcon from "@mui/icons-material/QueryStatsSharp";
// import { Link } from "react-router-dom";

// const UserSidebar = () => { 
//   return (
//     <div className="sidebar">
//       <div className="top">
//         <span className="logo">Epharmacy</span>
//       </div>
//       <hr />
//       <div className="center">
//         <ul>
//           <p className="title">MAIN</p>
//           <Link to={"/userDashboard"}>
//             <li>
//               <DashboardIcon className="icon" />
//               <span>Dashboard</span>
//             </li>
//           </Link>
//           <p className="title">LISTS</p>
//           <Link to="/userInventory">
//             <li>
//               <BloodtypeSharpIcon className="icon" />
//               <span>Past order</span>
//             </li>
//           </Link>

//           <Link to="/addorupdate">
//             <li>
//               <MedicalInformationSharpIcon className="icon" />
//               <span>Current Order</span>
//             </li>
//           </Link>
//           <Link to={"/userUpdatedetails"}>
//             <li>
//               <PersonAddAltSharpIcon className="icon" />
//               <span>Update Details of User</span>
//             </li>
//           </Link>
//         </ul>
//       </div>
//     </div>
//   );
// };
// export default UserSidebar;
