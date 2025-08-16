import React from 'react';
import Table from './Table';
import Sidebar from './Sidebar';
import './UserManagement.css'; // Same CSS file reuse
import { useNavigate } from 'react-router-dom';

const ContentManagement = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Yahan logout ka logic (localStorage clear, etc.)
    navigate('/login');
  };

  const contentItems = [
    { title: 'Phonics Basics', type: 'Lesson', category: 'Reading', difficulty: 'Beginner', updated: 'May 15, 2023' },
    { title: 'Word Recognition Game', type: 'Activity', category: 'Games', difficulty: 'Intermediate', updated: 'May 10, 2023' }
  ];

  return (
    <div className="admin-container">
      <Sidebar />

      <div className="main-content">
        {/* Header */}
        <div className="header">
          <h2>Content Management</h2>
          <div className="header-buttons">
            <button className="btn btn-primary">
              <i className="fas fa-plus"></i> Add Content
            </button>
            <button className="btn btn-logout" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="table-container">
          <Table 
            headers={['Title', 'Type', 'Category', 'Difficulty', 'Last Updated', 'Actions']}
            data={contentItems}
            renderRow={(item) => (
              <>
                <td>{item.title}</td>
                <td>{item.type}</td>
                <td>{item.category}</td>
                <td>{item.difficulty}</td>
                <td>{item.updated}</td>
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

export default ContentManagement;
