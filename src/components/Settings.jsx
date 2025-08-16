import React, { useState } from 'react';
import { FaUserCog, FaPalette, FaShieldAlt, FaBell, FaKeyboard } from 'react-icons/fa';
import Sidebar from './Sidebar';
import './UserManagement.css'; // Reuse styling for consistency
import { useNavigate } from 'react-router-dom';
import './Setting.css';

const Settings = () => {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('profile');
  const [formData, setFormData] = useState({
    name: 'Admin User',
    email: 'admin@dyslexiclearners.com',
    profilePic: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    theme: 'light',
    language: 'en',
    notifications: true,
    twoFactor: false,
    fontSize: 'medium',
    keyboardShortcuts: true
  });

  const handleLogout = () => {
    // Optional: Clear auth data
    navigate('/login');
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Settings saved:', formData);
    alert('Settings saved successfully!');
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          profilePic: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="admin-container">
      <Sidebar />

      <div className="main-content">
        {/* Header */}
        <div className="header">
          <h2>Settings</h2>
          <div className="header-buttons">
            <button className="btn btn-logout" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>

        {/* Settings Layout */}
        <div className="settings-container">
          {/* Left Tabs */}
          <div className="settings-sidebar">
            <button className={`settings-tab ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => setActiveTab('profile')}>
              <FaUserCog /> Profile Settings
            </button>
            <button className={`settings-tab ${activeTab === 'appearance' ? 'active' : ''}`} onClick={() => setActiveTab('appearance')}>
              <FaPalette /> Appearance
            </button>
            <button className={`settings-tab ${activeTab === 'security' ? 'active' : ''}`} onClick={() => setActiveTab('security')}>
              <FaShieldAlt /> Security
            </button>
            <button className={`settings-tab ${activeTab === 'accessibility' ? 'active' : ''}`} onClick={() => setActiveTab('accessibility')}>
              <FaKeyboard /> Accessibility
            </button>
            <button className={`settings-tab ${activeTab === 'notifications' ? 'active' : ''}`} onClick={() => setActiveTab('notifications')}>
              <FaBell /> Notifications
            </button>
          </div>

          {/* Right Content */}
          <div className="settings-content">
            <form onSubmit={handleSubmit}>
              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <div className="settings-section">
                  <h3><FaUserCog /> Profile Settings</h3>
                  <div className="form-group">
                    <label>Profile Picture</label>
                    <div className="profile-pic-upload">
                      <img src={formData.profilePic || 'https://ui-avatars.com/api/?name=Admin&background=random'} alt="Profile" />
                      <input type="file" accept="image/*" onChange={handleImageUpload} />
                      <button type="button">Change</button>
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Name</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} />
                  </div>
                  <div className="form-group">
                    <label>Email</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} />
                  </div>
                </div>
              )}

              {/* Security Tab */}
              {activeTab === 'security' && (
                <div className="settings-section">
                  <h3><FaShieldAlt /> Security Settings</h3>
                  <div className="form-group">
                    <label>Current Password</label>
                    <input type="password" name="currentPassword" value={formData.currentPassword} onChange={handleChange} />
                  </div>
                  <div className="form-group">
                    <label>New Password</label>
                    <input type="password" name="newPassword" value={formData.newPassword} onChange={handleChange} />
                  </div>
                  <div className="form-group">
                    <label>Confirm New Password</label>
                    <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} />
                  </div>
                  <div className="form-group checkbox">
                    <label>
                      <input type="checkbox" name="twoFactor" checked={formData.twoFactor} onChange={handleChange} />
                      Enable Two-Factor Authentication
                    </label>
                  </div>
                </div>
              )}

              {/* Appearance Tab */}
              {activeTab === 'appearance' && (
                <div className="settings-section">
                  <h3><FaPalette /> Appearance</h3>
                  <div className="form-group">
                    <label>Theme</label>
                    <select name="theme" value={formData.theme} onChange={handleChange}>
                      <option value="light">Light</option>
                      <option value="dark">Dark</option>
                      <option value="system">System Default</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Language</label>
                    <select name="language" value={formData.language} onChange={handleChange}>
                      <option value="en">English</option>
                      <option value="es">Spanish</option>
                      <option value="fr">French</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Accessibility Tab */}
              {activeTab === 'accessibility' && (
                <div className="settings-section">
                  <h3><FaKeyboard /> Accessibility</h3>
                  <div className="form-group">
                    <label>Font Size</label>
                    <select name="fontSize" value={formData.fontSize} onChange={handleChange}>
                      <option value="small">Small</option>
                      <option value="medium">Medium</option>
                      <option value="large">Large</option>
                      <option value="xlarge">Extra Large</option>
                    </select>
                  </div>
                  <div className="form-group checkbox">
                    <label>
                      <input type="checkbox" name="keyboardShortcuts" checked={formData.keyboardShortcuts} onChange={handleChange} />
                      Enable Keyboard Shortcuts
                    </label>
                  </div>
                  <div className="form-group checkbox">
                    <label>
                      <input type="checkbox" name="highContrast" checked={formData.highContrast} onChange={handleChange} />
                      High Contrast Mode
                    </label>
                  </div>
                </div>
              )}

              {/* Notifications Tab */}
              {activeTab === 'notifications' && (
                <div className="settings-section">
                  <h3><FaBell /> Notification Settings</h3>
                  <div className="form-group checkbox">
                    <label>
                      <input type="checkbox" name="notifications" checked={formData.notifications} onChange={handleChange} />
                      Enable Email Notifications
                    </label>
                  </div>
                  <div className="form-group checkbox">
                    <label>
                      <input type="checkbox" name="pushNotifications" checked={formData.pushNotifications} onChange={handleChange} />
                      Enable Push Notifications
                    </label>
                  </div>
                  <div className="form-group checkbox">
                    <label>
                      <input type="checkbox" name="soundNotifications" checked={formData.soundNotifications} onChange={handleChange} />
                      Enable Sound Alerts
                    </label>
                  </div>
                </div>
              )}

              {/* Save / Reset */}
              <div className="form-actions">
                <button type="submit" className="btn btn-primary">Save Settings</button>
                <button type="button" className="btn btn-secondary">Reset to Defaults</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
