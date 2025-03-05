

import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Clock, Heart, MapPin, User } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { useUserDetailsQuery } from '../app/userApiSlice';
import { getUsername } from '../app/userSlice';
import { getSearchQuery } from '../app/searchSlice';


const DashboardCard = ({ icon, title, description, to, delay }) => (
  <Link 
    to={to} 
    className="group" 
    style={{ animationDelay: `${delay}ms` }}
  >
    <div className="hover-card bg-white rounded-xl p-6 h-full">
      <div className="flex items-center mb-4">
        <div className="p-3 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors duration-300">
          {React.cloneElement(icon, { className: "w-6 h-6 text-primary" })}
        </div>
      </div>
      <h3 className="text-lg font-semibold text-gray-800 group-hover:text-primary transition-colors duration-300">
        {title}
      </h3>
      <p className="text-gray-600 mt-2 group-hover:text-gray-700 transition-colors duration-300">
        {description}
      </p>
    </div>
  </Link>
);

function UserHome() {
  
  const { data, isError, isLoading, error } = useUserDetailsQuery();
  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => {
      if(data) {
          // console.log('User data:', data);
          dispatch(getUsername(data.username));
          // dispatch(getCartCount(data.cart.length))

          
      }
  }, [data]);


  const username = useSelector((state) => state.userDetails.username);
  console.log(username)
  
  if(isError) {
    if(error.data.message === "Invalid JWT") {
        dispatch(getSearchQuery({ name: "" }));
      navigate('/login')
    //   console.log("Login")
    }
    return <p>{error.data.message}</p>
  }

if(isLoading) {
    return <p>Loading...</p>
}
  
  const cards = [
    {
      icon: <ShoppingBag />,
      title: "Current Orders",
      description: "Track your ongoing orders and shipments",
      to: "/userDashboard/orders"
    },
    {
      icon: <Clock />,
      title: "Past Orders",
      description: "View your order history and past purchases",
      to: "/userDashboard/past-orders"
    },
    // {
    //   icon: <Heart />,
    //   title: "Wishlist",
    //   description: "Manage your saved items for later",
    //   to: "/userDashboard/wishlist"
    // },
    // {
    //   icon: <MapPin />,
    //   title: "Addresses",
    //   description: "Manage your delivery addresses",
    //   to: "/userDashboard/addresses"
    // },
    {
      icon: <User />,
      title: "Profile",
      description: "Update your personal information",
      to: "/userDashboard/profile"
    }
  ];

  return (
    <div className="space-y-8">
      <div className="animate-slide-in">
        <h1 className="text-4xl font-bold text-gray-800">
          Welcome back, <span className="text-primary">{username}!</span>
        </h1>
        <p className="text-gray-600 mt-2">Manage your orders and account settings</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card, index) => (
          <div key={index} className="animate-scale-in" style={{ animationDelay: `${index * 100}ms` }}>
            <DashboardCard {...card} delay={index * 100} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default UserHome;


// import "./userHome.css";

// import BloodtypeSharpIcon from "@mui/icons-material/BloodtypeSharp";
// import MedicalInformationSharpIcon from "@mui/icons-material/MedicalInformationSharp";
// import PersonAddAltSharpIcon from "@mui/icons-material/PersonAddAltSharp";
// import Sidebar from "../Components/UserSidebar.jsx";

// import { Link } from "react-router-dom";
// import Widgets from "../Components/UserWidgets.jsx";
// import { useEffect, useState } from "react";
// import axios from "axios";
// export default function UserHome() {

//   const [userPastOrders, setUserPastOrders] = useState(0);
//   useEffect(() => {

//     const call = async () => {
//       const resp = await axios.get('/userPastOrders');
//       setUserPastOrders(resp.data.length);
//     }
//     call();

//   }, [userPastOrders])
//   return (
//     <div className="home">
//       <Sidebar />
//       <div className="homeContainer">
        
//         {/* <Carousel/> */}
//         <div className="widgets">
//           <Link to={"/userInventory"}>
//             {" "}
//             <Widgets
//               name="Past Orders"
//               count={userPastOrders}
//               see="See The Medicines"
//               icon={<BloodtypeSharpIcon />}
//             />{" "}
//           </Link>
//           <Link to={"/addorupdate"}>
//             {" "}
//             <Widgets
//               name="Current Orders"
//               count={"Current Orders"}
//               see="See The Medicines"
//               icon={<MedicalInformationSharpIcon />}
//             />{" "}
//           </Link>
//           <Link to={"/userUpdatedetails"}>
//             {" "}
//             <Widgets
//               name="Update Details Of The User"
//               count={"Update Details"}
//               see="See The Details"
//               icon={<PersonAddAltSharpIcon />}
//             />{" "}
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// }
