import React from 'react';
import { useNavigate } from 'react-router-dom';
import Card from './Card';
import Table from './Table';
import './Dashboard.css';
import Sidebar from './Sidebar';
import './Sidebar.css';

const Dashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Agar localStorage/sessionStorage me token store hai to yahan remove karo
    // localStorage.removeItem('authToken'); 
    navigate('/login'); // Login page pe bhej do
  };

  const stats = [
    { title: 'Total Users', value: '1,248', change: '+12% from last month', icon: 'users', color: 'primary' },
    { title: 'Content Items', value: '568', change: '+24 new this week', icon: 'book', color: 'success' },
    { title: 'Recent Uploads', value: '42', change: 'Last 7 days', icon: 'upload', color: 'warning' },
    { title: 'Active Sessions', value: '86', change: 'Currently online', icon: 'chart-line', color: 'danger' }
  ];

  const activities = [
    { action: 'Added', user: 'John Doe', details: 'New lesson "Phonics Basics"', time: '10 mins ago', status: 'active' },
    { action: 'Updated', user: 'Sarah Smith', details: 'User profile information', time: '25 mins ago', status: 'active' },
    { action: 'Deleted', user: 'Admin', details: 'Outdated exercise', time: '1 hour ago', status: 'inactive' },
    { action: 'Login', user: 'Michael Brown', details: 'Successful login', time: '2 hours ago', status: 'active' }
  ];

  const logins = [
    { user: 'John Doe', email: 'john@example.com', role: 'Teacher', ip: '192.168.1.1', time: 'Just now' },
    { user: 'Sarah Smith', email: 'sarah@example.com', role: 'Admin', ip: '192.168.1.45', time: '15 mins ago' },
    { user: 'Michael Brown', email: 'michael@example.com', role: 'Parent', ip: '192.168.1.102', time: '1 hour ago' }
  ];

  return (
    <div className="admin-container">
      <Sidebar />

      <div className="main-content">
        <div className="header">
          <h2>Dashboard Overview</h2>
          <div className="header-actions">
            <div className="user-profile">
              <img src="https://ui-avatars.com/api/?name=Admin&background=random" alt="Admin" />
              <span>Admin</span>
            </div>
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>

        <div className="card-container">
          {stats.map((stat, index) => (
            <Card key={index} {...stat} />
          ))}
        </div>

        <div className="table-container">
          <h3>Recent Activity</h3>
          <Table 
            headers={['Action', 'User', 'Details', 'Time']}
            data={activities}
            renderRow={(item) => (
              <>
                <td><span className={`status ${item.status}`}>{item.action}</span></td>
                <td>{item.user}</td>
                <td>{item.details}</td>
                <td>{item.time}</td>
              </>
            )}
          />
        </div>

        <div className="table-container">
          <h3>Recent Logins</h3>
          <Table 
            headers={['User', 'Email', 'Role', 'IP Address', 'Time']}
            data={logins}
            renderRow={(item) => (
              <>
                <td>{item.user}</td>
                <td>{item.email}</td>
                <td>{item.role}</td>
                <td>{item.ip}</td>
                <td>{item.time}</td>
              </>
            )}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
