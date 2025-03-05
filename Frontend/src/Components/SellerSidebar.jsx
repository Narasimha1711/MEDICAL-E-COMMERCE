import "./sellerSidebar.css";
import { 
  LayoutDashboard, 
  PackageSearch, 
  Pill, 
  UserCog, 
  User, 
  LogOut,
  Stethoscope
} from 'lucide-react';
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const SellerSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeLink, setActiveLink] = useState(location.pathname);

  const handleLinkClick = (path) => {
    setActiveLink(path);
  };

  const handleLogout = () => {
    handleLinkClick('/logout');
    navigate('/sellerLogin');
  };

  return (
    <div className="sidebar">
      <div className="top">
        <Link to="/dashboard" onClick={() => handleLinkClick("/dashboard")} className="logo-link">
          <Stethoscope className="logo-icon" />
          <span className="logo">Epharmacy</span>
        </Link>
      </div>
      
      <div className="center">
        <ul className="nav-list">
          <p className="title">MAIN</p>
          <Link 
            to="/dashboard" 
            onClick={() => handleLinkClick("/dashboard")}
            className="nav-link"
          >
            <li className={`nav-item ${activeLink === "/dashboard" ? "active" : ""}`}>
              <LayoutDashboard className="icon" />
              <span>Dashboard</span>
            </li>
          </Link>

          <p className="title">INVENTORY</p>
          <Link
            to="/inventory"
            onClick={() => handleLinkClick("/inventory")}
            className="nav-link"
          >
            <li className={`nav-item ${activeLink === "/inventory" ? "active" : ""}`}>
              <PackageSearch className="icon" />
              <span>Your Inventory</span>
            </li>
          </Link>

          <Link
            to="/updateMedicine"
            onClick={() => handleLinkClick("/updateMedicine")}
            className="nav-link"
          >
            <li className={`nav-item ${activeLink === "/updateMedicine" ? "active" : ""}`}>
              <Pill className="icon" />
              <span>Manage Medicines</span>
            </li>
          </Link>

          <p className="title">SETTINGS</p>
          {/* <Link 
            to="/revenuestats" 
            onClick={() => handleLinkClick("/updateinfo")}
            className="nav-link"
          >
            <li className={`nav-item ${activeLink === "/updateinfo" ? "active" : ""}`}>
              <UserCog className="icon" />
              <span>Revenue Stats</span>
            </li>
          </Link> */}

          <Link 
            to="/sellerProfile" 
            onClick={() => handleLinkClick("/sellerProfile")}
            className="nav-link"
          >
            <li className={`nav-item ${activeLink === "/sellerProfile" ? "active" : ""}`}>
              <User className="icon" />
              <span>Profile</span>
            </li>
          </Link>

          <li 
            className={`nav-item logout ${activeLink === "/logout" ? "active" : ""}`}
            onClick={handleLogout}
          >
            <LogOut className="icon" />
            <span>Logout</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default SellerSidebar;