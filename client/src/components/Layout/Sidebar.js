// client/src/components/Layout/Sidebar.js
import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  FaChartBar, 
  FaBox, 
  FaUsers, 
  FaExchangeAlt, 
  FaFileAlt, 
  FaCog 
} from 'react-icons/fa';

const Sidebar = () => {
  return (
    <div className="sidebar bg-dark text-white h-100">
      <div className="sidebar-brand p-4">
        <h5>Inventory System</h5>
      </div>
      <hr className="mx-3 bg-light" />
      <div className="sidebar-menu">
        <ul className="nav flex-column">
          <li className="nav-item">
            <NavLink 
              to="/" 
              className={({ isActive }) => 
                `nav-link d-flex align-items-center p-3 ${isActive ? 'active bg-primary' : ''}`
              }
            >
              <FaChartBar className="me-3" />
              <span>Dashboard</span>
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink 
              to="/products" 
              className={({ isActive }) => 
                `nav-link d-flex align-items-center p-3 ${isActive ? 'active bg-primary' : ''}`
              }
            >
              <FaBox className="me-3" />
              <span>Products</span>
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink 
              to="/customers" 
              className={({ isActive }) => 
                `nav-link d-flex align-items-center p-3 ${isActive ? 'active bg-primary' : ''}`
              }
            >
              <FaUsers className="me-3" />
              <span>Customers</span>
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink 
              to="/transactions" 
              className={({ isActive }) => 
                `nav-link d-flex align-items-center p-3 ${isActive ? 'active bg-primary' : ''}`
              }
            >
              <FaExchangeAlt className="me-3" />
              <span>Transactions</span>
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink 
              to="/reports" 
              className={({ isActive }) => 
                `nav-link d-flex align-items-center p-3 ${isActive ? 'active bg-primary' : ''}`
              }
            >
              <FaFileAlt className="me-3" />
              <span>Reports</span>
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink 
              to="/settings" 
              className={({ isActive }) => 
                `nav-link d-flex align-items-center p-3 ${isActive ? 'active bg-primary' : ''}`
              }
            >
              <FaCog className="me-3" />
              <span>Settings</span>
            </NavLink>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;