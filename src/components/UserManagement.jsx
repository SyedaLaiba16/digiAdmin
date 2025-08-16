import React, { useEffect, useState } from 'react';
import Table from './Table';
import Sidebar from './Sidebar';
import './UserManagement.css';
import './Sidebar.css';
import { useNavigate } from 'react-router-dom';
import { db } from '../config/firebase';  // ✅ Firestore import
import {
  collection,
  addDoc,
  deleteDoc,
  updateDoc,
  doc,
  onSnapshot
} from "firebase/firestore";


const UserManagement = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({
    fullName: "",
    email: "",
    role: "",
    age: "",
    gender: "",
    status: "active",
    dyslexiaLevel: "",
    parentName: "",
    contactNumber: "",
    relationship: "",
    description: "",
  });
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null); // ✅ Edit mode tracking

  // 🔹 Realtime Fetch Users
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "usersadd"), (snapshot) => {
      const usersData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUsers(usersData);
    });
    return () => unsub();
  }, []);

  // 🔹 Add / Update User
  const handleSaveUser = async (e) => {
    e.preventDefault();
    if (!newUser.fullName || !newUser.email || !newUser.role) {
      alert("Please fill required fields");
      return;
    }
    try {
      if (editId) {
        // ✅ Update existing user
        const userRef = doc(db, "usersadd", editId);
        await updateDoc(userRef, {
          ...newUser,
          lastUpdated: new Date().toISOString(),
        });
        setEditId(null);
      } else {
        // ✅ Add new user
        await addDoc(collection(db, "usersadd"), {
          ...newUser,
          joined: new Date().toLocaleDateString(),
          lastLogin: new Date().toISOString(),
        });
      }

      // reset fields
      setNewUser({
        fullName: "",
        email: "",
        role: "",
        age: "",
        gender: "",
        status: "active",
        dyslexiaLevel: "",
        parentName: "",
        contactNumber: "",
        relationship: "",
        description: "",
      });

      setShowForm(false);
    } catch (error) {
      console.error("Error saving user: ", error);
      alert("Something went wrong, please try again.");
    }
  };

  // 🔹 Delete User
  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "usersadd", id));
  };

  // 🔹 Edit User
  const handleEdit = (user) => {
    setNewUser(user);
    setEditId(user.id);
    setShowForm(true);
  };

  const handleLogout = () => {
    navigate('/login');
  };

  return (
    <div className="admin-container">
      <Sidebar />
      <div className="main-content">

        {/* Header */}
        <div className="header">
          <h2>User Management</h2>
          <div className="header-buttons">
            <button className="btn btn-primary" onClick={() => {
              setShowForm(true);
              setEditId(null); // ✅ Reset edit mode
              setNewUser({
                fullName: "",
                email: "",
                role: "",
                age: "",
                gender: "",
                status: "active",
                dyslexiaLevel: "",
                parentName: "",
                contactNumber: "",
                relationship: "",
                description: "",
              });
            }}>
              <i className="fas fa-plus"></i> Add User
            </button>
            <button className="btn btn-logout" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>

        {/* Add / Edit User Form */}
        {showForm && (
          <form className="add-user-form" onSubmit={handleSaveUser}>
            
            <div className="form-group">
              <label>Full Name *</label>
              <input
                type="text"
                value={newUser.fullName}
                onChange={(e) => setNewUser({ ...newUser, fullName: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label>Email *</label>
              <input
                type="email"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label>Role *</label>
              <select
                value={newUser.role}
                onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                required
              >
                <option value="">Select Role</option>
                <option value="Admin">Admin</option>
                <option value="Teacher">Teacher</option>
                <option value="Student">Student</option>
                <option value="Parent">Parent</option>
              </select>
            </div>

            <div className="form-group">
              <label>Age</label>
              <input
                type="number"
                value={newUser.age}
                onChange={(e) => setNewUser({ ...newUser, age: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Gender</label>
              <select
                value={newUser.gender}
                onChange={(e) => setNewUser({ ...newUser, gender: e.target.value })}
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label>Dyslexia Level</label>
              <select
                value={newUser.dyslexiaLevel}
                onChange={(e) => setNewUser({ ...newUser, dyslexiaLevel: e.target.value })}
              >
                <option value="">Select</option>
                <option value="Mild">Mild</option>
                <option value="Moderate">Moderate</option>
                <option value="Severe">Severe</option>
              </select>
            </div>

            <div className="form-group">
              <label>Parent / Guardian Name</label>
              <input
                type="text"
                value={newUser.parentName}
                onChange={(e) => setNewUser({ ...newUser, parentName: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Contact Number</label>
              <input
                type="text"
                value={newUser.contactNumber}
                onChange={(e) => setNewUser({ ...newUser, contactNumber: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Relationship</label>
              <select
                value={newUser.relationship}
                onChange={(e) => setNewUser({ ...newUser, relationship: e.target.value })}
              >
                <option value="">Select</option>
                <option value="Father">Father</option>
                <option value="Mother">Mother</option>
                <option value="Guardian">Guardian</option>
              </select>
            </div>

            <div className="form-group">
              <label>Description / Weaknesses</label>
              <textarea
                value={newUser.description}
                onChange={(e) => setNewUser({ ...newUser, description: e.target.value })}
              ></textarea>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn-success">
                {editId ? "Update" : "Save"}
              </button>
              <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </form>
        )}

        {/* Table */}
        <div className="table-container">
          <Table
            headers={['Name', 'Email', 'Role', 'Age', 'Gender', 'Dyslexia Level', 'Parent Name', 'Description', 'Joined', 'Status', 'Actions']}
            data={users}
            renderRow={(item) => (
              <>
                <td>{item.fullName}</td>
                <td>{item.email}</td>
                <td>{item.role}</td>
                <td>{item.age}</td>
                <td>{item.gender}</td>
                <td>{item.dyslexiaLevel}</td>
                <td>{item.parentName}</td>
                <td>{item.description}</td> {/* ✅ Description column */}
                <td>{item.joined}</td>
                <td><span className={`status ${item.status}`}>{item.status}</span></td>
                <td>
                  <button className="action-btn edit-btn" onClick={() => handleEdit(item)}>
                    <i className="fas fa-edit"></i>
                  </button>
                  <button className="action-btn delete-btn" onClick={() => handleDelete(item.id)}>
                    <i className="fas fa-trash"></i>
                  </button>
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
