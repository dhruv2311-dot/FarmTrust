// import React, { useState } from 'react';
// import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
// import { FaUser, FaShoppingBag, FaShoppingCart } from 'react-icons/fa';
// import { IoLogOutSharp } from "react-icons/io5";
// import { FaBars } from 'react-icons/fa';
// import profilePic from '../assets/priya-singh.jpg';
// import UserProfile from './UserProfile/UserProfile';
// import './UserDashboard.css'
// import UserOrders from './UserOrders/UserOrders';
// import UserCart from './UserCart/UserCart';
// import UserChat from './UserChat/UserChat';
// import { IoMdChatbubbles } from "react-icons/io";

// const UserDashboard = () => {
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const navigate = useNavigate();
//   const location = useLocation();

//   const toggleSidebar = () => {
//     setSidebarOpen(!sidebarOpen);
//   };

//   const handleMenuClick = (path) => {
//     navigate(path);
//     if (window.innerWidth <= 768) {
//       setSidebarOpen(false);
//     }
//   };

//   const isActive = (path) => {
//     return location.pathname.includes(path) ? 'active' : '';
//   };

//   return (
//     <div className="dashboard-wrapper">
//       {/* Mobile Menu Button */}
//       <div className="mobile-menu-button" onClick={toggleSidebar}>
//         <FaBars />
//       </div>

//       {/* Fixed Sidebar */}
//       <div className={`sidebar ${sidebarOpen ? 'sidebar-open' : ''}`}>
//         <div className="profile-pic-section">
//           <img src={profilePic} alt="Profile" className="profile-pic" />
//         </div>
//         <ul className="sidebar-menu">
//           <li 
//             className={isActive('/user/profile')}
//             onClick={() => handleMenuClick('/user/profile')}
//           >
//             <FaUser className="icon" /> Profile Information
//           </li>
//           <li 
//             className={isActive('/user/orders')}
//             onClick={() => handleMenuClick('/user/orders')}
//           >
//             <FaShoppingBag className="icon" /> My Orders
//           </li>
//           <li 
//             className={isActive('/user/cart')}
//             onClick={() => handleMenuClick('/user/cart')}
//           >
//             <FaShoppingCart className="icon" /> Cart
//           </li>
//           <li 
//             className={isActive('/user/messages')}
//             onClick={() => handleMenuClick('/user/messages')}
//           >
//             <IoMdChatbubbles className="icon" /> Messages
//           </li>
//           <li>
//             <IoLogOutSharp className="icon" /> Logout
//           </li>
//         </ul>
//       </div>

//       {/* Main Content */}
//       <div className="content-wrapper">
//         <Routes>
//           <Route path="/" element={<Navigate to="/user/profile" replace />} />
//           <Route path="/profile" element={<UserProfile />} />
//           <Route path="/orders" element={<UserOrders/>} />
//           <Route path="/cart" element={<UserCart />} />
//           <Route path="/messages" element={<UserChat />} />
//         </Routes>
//       </div>
//     </div>
//   );
// };

// export default UserDashboard;

// UserDashboard.jsx
import React, { useState } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { FaUser, FaShoppingBag, FaShoppingCart } from 'react-icons/fa';
import { IoLogOutSharp } from "react-icons/io5";
import { FaBars } from 'react-icons/fa';
import profilePic from '../assets/priya-singh.jpg';
import UserProfile from './UserProfile/UserProfile';
import './UserDashboard.css';
import UserOrders from './UserOrders/UserOrders';
import UserCart from './UserCart/UserCart';
import UserChat from './UserChat/UserChat';
import { IoMdChatbubbles } from "react-icons/io";

const UserDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleMenuClick = (path) => {
    navigate(path);
    if (window.innerWidth <= 768) {
      setSidebarOpen(false);
    }
  };

  const isActive = (path) => {
    return location.pathname.includes(path) ? 'active' : '';
  };

  return (
    <div className="dashboard-wrapper">
      {/* Mobile Menu Button */}
      <div className="mobile-menu-button" onClick={toggleSidebar}>
        <FaBars />
      </div>

      {/* Fixed Sidebar */}
      <div className={`sidebar ${sidebarOpen ? 'sidebar-open' : ''}`}>
        <div className="profile-pic-section">
          <img src={profilePic} alt="Profile" className="profile-pic" />
        </div>
        <ul className="sidebar-menu">
          <li 
            className={isActive('/user/profile')}
            onClick={() => handleMenuClick('/user/profile')}
          >
            <FaUser className="icon" /> Profile Information
          </li>
          <li 
            className={isActive('/user/orders')}
            onClick={() => handleMenuClick('/user/orders')}
          >
            <FaShoppingBag className="icon" /> My Orders
          </li>
          <li 
            className={isActive('/user/cart')}
            onClick={() => handleMenuClick('/user/cart')}
          >
            <FaShoppingCart className="icon" /> Cart
          </li>
          <li 
            className={isActive('/user/messages')}
            onClick={() => handleMenuClick('/user/messages')}
          >
            <IoMdChatbubbles className="icon" /> Messages
          </li>
          <li>
            <IoLogOutSharp className="icon" /> Logout
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="content-wrapper">
        <Routes>
          <Route path="/" element={<Navigate to="/user/profile" replace />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/orders" element={<UserOrders />} />
          <Route path="/cart" element={<UserCart />} />
          <Route path="/messages" element={<UserChat />} />
        </Routes>
      </div>
    </div>
  );
};

export default UserDashboard;