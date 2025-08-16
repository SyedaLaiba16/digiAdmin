import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  FaTachometerAlt, 
  FaUsers, 
  FaBook, 
  FaFileImage, 
  FaChartBar, 
  FaCog, 
  FaShieldAlt 
} from 'react-icons/fa';

const Sidebar = () => {
  const location = useLocation(); // Proper way to get current location

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h3>Dyslexic Learners</h3>
      </div>
      <div className="sidebar-menu">
        <Link 
          to="/admin-dashboard" 
          className={`menu-item ${location.pathname === '/admin-dashboard' ? 'active' : ''}`}
        >
          <FaTachometerAlt />
          <span>Dashboard</span>
        </Link>
        <Link 
          to="/users" 
          className={`menu-item ${location.pathname === '/users' ? 'active' : ''}`}
        >
          <FaUsers />
          <span>User Management</span>
        </Link>
        <Link 
          to="/content" 
          className={`menu-item ${location.pathname === '/content' ? 'active' : ''}`}
        >
          <FaBook />
          <span>Content Management</span>
        </Link>
        <Link 
          to="/media" 
          className={`menu-item ${location.pathname === '/media' ? 'active' : ''}`}
        >
          <FaFileImage />
          <span>Media Library</span>
        </Link>
        <Link 
          to="/reports" 
          className={`menu-item ${location.pathname === '/reports' ? 'active' : ''}`}
        >
          <FaChartBar />
          <span>Reports & Analytics</span>
        </Link>
        <Link 
          to="/settings" 
          className={`menu-item ${location.pathname === '/settings' ? 'active' : ''}`}
        >
          <FaCog />
          <span>Settings</span>
        </Link>
        <Link 
          to="/security" 
          className={`menu-item ${location.pathname === '/security' ? 'active' : ''}`}
        >
          <FaShieldAlt />
          <span>Security & Logs</span>
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;