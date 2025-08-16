import React from 'react';
import Table from './Table';
import Sidebar from './Sidebar';
import './UserManagement.css';
import './Sidebar.css';
import { useNavigate } from 'react-router-dom';

const UserManagement = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Yahan logout ka logic laga sakte ho (localStorage clear, etc.)
    navigate('/login');
  };

  const users = [
    { name: 'Admin User', email: 'admin@dyslexiclearners.com', role: 'Admin', joined: 'Jan 15, 2023', status: 'active' },
    { name: 'Sarah Johnson', email: 'sarah@example.com', role: 'Teacher', joined: 'Mar 2, 2023', status: 'active' },
    { name: 'Michael Brown', email: 'michael@example.com', role: 'Parent', joined: 'Apr 10, 2023', status: 'inactive' }
  ];

  return (
    <div className="admin-container">
      <Sidebar />
      <div className="main-content">
        
        {/* Header with title + buttons */}
        <div className="header">
          <h2>User Management</h2>
          <div className="header-buttons">
            <button className="btn btn-primary">
              <i className="fas fa-plus"></i> Add User
            </button>
            <button className="btn btn-logout" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="form-container">
          <div className="filters">
            <input type="text" className="form-control" placeholder="Search users..." />
            <select className="form-control">
              <option>Filter by Role</option>
              <option>Admin</option>
              <option>Teacher</option>
              <option>Student</option>
              <option>Parent</option>
            </select>
            <select className="form-control">
              <option>Filter by Status</option>
              <option>Active</option>
              <option>Inactive</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="table-container">
          <Table 
            headers={['Name', 'Email', 'Role', 'Joined', 'Status', 'Actions']}
            data={users}
            renderRow={(item) => (
              <>
                <td>{item.name}</td>
                <td>{item.email}</td>
                <td>{item.role}</td>
                <td>{item.joined}</td>
                <td><span className={`status ${item.status}`}>{item.status}</span></td>
                <td>
                  <button className="action-btn edit-btn"><i className="fas fa-edit"></i></button>
                  <button className="action-btn delete-btn"><i className="fas fa-trash"></i></button>
                </td>
              </>
            )}
          />
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
