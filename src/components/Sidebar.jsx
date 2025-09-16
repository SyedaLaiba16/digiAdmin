import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  FaTachometerAlt, 
  FaUsers, 
  FaBook, 
  FaChartBar, 
  FaCog, 
  FaShieldAlt,
  FaBars,
  FaTimes
} from 'react-icons/fa';
import './Sidebar.css';

const Sidebar = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Mobile toggle button */}
      <button className="sidebar-toggle" onClick={toggleSidebar}>
        {isOpen ? <FaTimes /> : <FaBars />}
      </button>
      
      {/* Overlay for mobile when sidebar is open */}
      {isOpen && <div className="sidebar-overlay" onClick={toggleSidebar}></div>}
      
      <div className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h3>Dyslexic Learners</h3>
          <button className="sidebar-close" onClick={toggleSidebar}>
            <FaTimes />
          </button>
        </div>
        <div className="sidebar-menu">
          <Link 
            to="/admin-dashboard" 
            className={`menu-item ${location.pathname === '/admin-dashboard' ? 'active' : ''}`}
            onClick={() => setIsOpen(false)}
          >
            <FaTachometerAlt />
            <span>Dashboard</span>
          </Link>
          <Link 
            to="/users" 
            className={`menu-item ${location.pathname === '/users' ? 'active' : ''}`}
            onClick={() => setIsOpen(false)}
          >
            <FaUsers />
            <span>User Management</span>
          </Link>
          <Link 
            to="/content" 
            className={`menu-item ${location.pathname === '/content' ? 'active' : ''}`}
            onClick={() => setIsOpen(false)}
          >
            <FaBook />
            <span>Content Management</span>
          </Link>
          <Link 
            to="/reports" 
            className={`menu-item ${location.pathname === '/reports' ? 'active' : ''}`}
            onClick={() => setIsOpen(false)}
          >
            <FaChartBar />
            <span>Reports & Analytics</span>
          </Link>
          <Link 
            to="/settings" 
            className={`menu-item ${location.pathname === '/settings' ? 'active' : ''}`}
            onClick={() => setIsOpen(false)}
          >
            <FaCog />
            <span>Settings</span>
          </Link>
          <Link 
            to="/security" 
            className={`menu-item ${location.pathname === '/security' ? 'active' : ''}`}
            onClick={() => setIsOpen(false)}
          >
            <FaShieldAlt />
            <span>Security & Logs</span>
          </Link>
        </div>
      </div>
    </>
  );
};

export default Sidebar;